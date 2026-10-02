set shell := ["bash", "-euo", "pipefail", "-c"]

operator_env := if path_exists(".local/operator/.env") == "true" { ".local/operator/.env" } else { ".local/operator/.env.example" }
compose := "docker compose --env-file " + operator_env + " --project-name portal-guesant-saberes -f .container/docker-compose.yml"
bake := "docker buildx bake --file .container/docker-bake.hcl"
quality_image := env_var_or_default("QUALITY_IMAGE", "portal-guesant-saberes-quality:local")
tools_image := env_var_or_default("TOOLS_IMAGE", "portal-guesant-saberes-tools:local")
dev_image := env_var_or_default("DEV_IMAGE", "portal-guesant-saberes-dev:local")
playwright_image := env_var_or_default("PLAYWRIGHT_IMAGE", "portal-guesant-saberes-playwright:local")
workspace_modules_volume := "portal-guesant-saberes-workspace-modules"
app := compose + " run --rm -T dev sh -lc"

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
	docker run --rm {{dev_image}} deno task quality:check:fast

heavy-checks: dev-build
	{{app}} 'deno install --frozen --node-modules-dir=auto && deno task heavy-checks'
	just build-check
	just e2e
	just accessibility
	just lighthouse
	just security-audit
	just supply-chain
	just complexity-report
	just repository-lint
	just reuse-check

format:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task format'

format-check:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task check:format'

migration-format:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task db:format'

migration-format-check:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task db:format:check'

lint:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task check:lint'

typecheck:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task typecheck'

ast-grep:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task ast-grep'

test:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task test'

architecture:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task architecture:check'

content:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task content:validate'

content-migrate: dev-build
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task db:migrate'

content-migration-status: dev-build
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task db:status'

security:
    {{app}} 'deno install --frozen --node-modules-dir=auto && deno task security:check'

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
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -lc 'deno install --frozen --node-modules-dir=auto && deno task e2e'

accessibility: runtime-build playwright-build
    #!/usr/bin/env bash
    set -euo pipefail
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    docker volume create {{workspace_modules_volume}} >/dev/null
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -lc 'deno install --frozen --node-modules-dir=auto && deno task e2e -- packages/app/tests/e2e/accessibility.spec.ts'

lighthouse: runtime-build quality-build
    #!/usr/bin/env bash
    set -euo pipefail
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e LHCI_BUILD_CONTEXT__CURRENT_HASH=local {{quality_image}} bash -lc 'deno install --frozen --node-modules-dir=auto && deno task lighthouse'

ci: check

repository-lint: quality-build
    docker run --rm -v "$PWD:/workspace:ro" {{quality_image}} bash -lc 'yamllint -c .config/.yamllint.yml .github .config/.yamllint.yml && hadolint --config .config/.hadolint.yaml .container/Dockerfile && for workflow in .github/workflows/*.yml; do actionlint -color "$workflow"; done && zizmor .github/workflows'

reuse-check: quality-build
    docker run --rm -v "$PWD:/workspace:ro" {{quality_image}} bash -lc 'reuse lint'

security-audit: quality-build
    docker run --rm -v "$PWD:/repo:ro" {{quality_image}} bash -lc 'gitleaks dir --no-banner --redact --config /repo/.config/.gitleaks.toml /repo && osv-scanner scan source --recursive /repo && trivy fs --skip-version-check --no-progress --scanners vuln,secret --severity CRITICAL,HIGH --exit-code 1 /repo && semgrep scan --config auto --error --exclude node_modules --exclude dist /repo/packages /repo/.tools'

supply-chain: quality-build
    {{app}} 'deno run --allow-read --allow-env .tools/check-supply-chain.ts'

complexity-report: quality-build
    mkdir -p .cache
    docker run --rm -v "$PWD:/workspace" -w /workspace {{quality_image}} bash -lc 'lizard -l typescript -C 5 -L 35 -a 3 packages | tee .cache/lizard.txt'
