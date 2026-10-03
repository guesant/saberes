set shell := ["bash", "-euo", "pipefail", "-c"]

operator_env := if path_exists(".local/operator/.env") == "true" { ".local/operator/.env" } else { ".local/operator/.env.example" }
compose := "docker compose --env-file " + operator_env + " --project-name portal-guesant-saberes -f .config/container/docker-compose.yml"
bake := "docker buildx bake --file .config/container/docker-bake.hcl"
quality_image := env_var_or_default("QUALITY_IMAGE", "portal-guesant-saberes-quality:local")
tools_image := env_var_or_default("TOOLS_IMAGE", "portal-guesant-saberes-tools:local")
dev_image := env_var_or_default("DEV_IMAGE", "portal-guesant-saberes-dev:local")
playwright_image := env_var_or_default("PLAYWRIGHT_IMAGE", "portal-guesant-saberes-playwright:local")
workspace_modules_volume := "portal-guesant-saberes-workspace-modules"
app := compose + " run --rm -T dev bash -c"

default: check

tools-build:
    {{bake}} --load tools

dev-build:
	{{bake}} --load dev

quality-build:
	{{bake}} --load quality
	{{bake}} --load quality-ci
	{{bake}} --load dev

playwright-build:
    {{bake}} --load playwright

runtime-build:
    {{bake}} --load runtime

tools-shell: tools-build
    docker run --rm -it -v "$PWD:/workspace" -v "$PWD/.cache/deno:/deno/cache" -w /workspace {{tools_image}} bash

check: dev-build
	docker run --rm {{dev_image}} mise exec -- deno task quality:check:fast

heavy-checks: dev-build
	{{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task heavy-checks'
	just build-check
	just e2e
	just accessibility
	just lighthouse
	just security-audit
	just complexity-report
	just repository-lint
	just reuse-check

format:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task format'

format-check:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task check:format'

migration-format:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task db:format'

migration-format-check:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task db:format:check'

spelling:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task cspell'

docs-links:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task docs:links'

placeholders:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task placeholders'

commit-check:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task commit:check'

lint:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task check:lint'

typecheck:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task typecheck'

ast-grep:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task ast-grep'

comments:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task comments'

test:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task test'

architecture:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task architecture:check'

content:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task content:validate'

content-migrate: dev-build
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task db:migrate'

content-migration-status: dev-build
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task db:status'

schema-docs: dev-build
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task database:schema-docs'

security:
    {{app}} 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task security:check'

build:
    just runtime-build

build-check:
    {{bake}} build-check

e2e: runtime-build playwright-build
    #!/usr/bin/env bash
    set -euo pipefail
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    docker volume create {{workspace_modules_volume}} >/dev/null
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task e2e'

accessibility: runtime-build playwright-build
    #!/usr/bin/env bash
    set -euo pipefail
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    docker volume create {{workspace_modules_volume}} >/dev/null
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task e2e -- packages/app/tests/e2e/accessibility.spec.ts'

lighthouse: runtime-build quality-build
    #!/usr/bin/env bash
    set -euo pipefail
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e LHCI_BUILD_CONTEXT__CURRENT_HASH=local {{quality_image}} bash -c 'mise exec -- deno install --frozen --node-modules-dir=auto && mise exec -- deno task lighthouse'

ci: check

repository-lint: quality-build
    docker run --rm -v "$PWD:/workspace:ro" {{quality_image}} bash -c 'aqua exec -- yamllint -c .config/.yamllint.yml .github .config/.yamllint.yml && aqua exec -- hadolint --config .config/.hadolint.yaml .config/container/Dockerfile && for workflow in .github/workflows/*.yml; do aqua exec -- actionlint -color "$workflow"; done && aqua exec -- zizmor .github/workflows'

reuse-check: quality-build
    docker run --rm -v "$PWD:/workspace:ro" {{quality_image}} bash -c 'reuse lint'

security-audit: quality-build
    docker run --rm -v "$PWD:/repo:ro" -v portal-guesant-saberes-trivy-cache:/root/.cache/trivy {{quality_image}} bash -c 'aqua exec -- gitleaks dir --no-banner --redact --config /repo/.config/.gitleaks.toml /repo && aqua exec -- osv-scanner scan source --recursive /repo && aqua exec -- trivy fs --config /repo/.config/trivy.yaml --ignorefile="" --secret-config="" /repo && semgrep scan --config auto --error --exclude node_modules --exclude dist /repo/packages /repo/.tools'

complexity-report: quality-build
    mkdir -p .cache
    docker run --rm -v "$PWD:/workspace" -w /workspace {{quality_image}} bash -c 'lizard -l typescript -C 5 -L 35 -a 3 packages | tee .cache/lizard.txt'
