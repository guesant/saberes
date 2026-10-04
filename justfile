set shell := ["bash", "-euo", "pipefail", "-c"]

operator_env := if path_exists(".local/operator/.env") == "true" { ".local/operator/.env" } else { ".local/operator/.env.example" }
compose := "docker compose --env-file " + operator_env + " --project-name portal-guesant-saberes -f .config/container/docker-compose.yml"
bake := "docker buildx bake --file .config/container/docker-bake.hcl"
quality_image := env_var_or_default("QUALITY_IMAGE", "portal-guesant-saberes-quality:local")
tools_image := env_var_or_default("TOOLS_IMAGE", "portal-guesant-saberes-tools:local")
dev_image := env_var_or_default("DEV_IMAGE", "portal-guesant-saberes-dev:local")
playwright_image := env_var_or_default("PLAYWRIGHT_IMAGE", "portal-guesant-saberes-playwright:local")
app_image := env_var_or_default("APP_IMAGE", "portal-guesant-saberes-app:local")
workspace_modules_volume := "portal-guesant-saberes-workspace-modules-manual"
workspace_modules_init := "docker run --rm -v " + workspace_modules_volume + ":/mnt/node_modules " + dev_image + " bash -c 'if ! cmp -s /workspace/node_modules/.toolchain-lock /mnt/node_modules/.toolchain-lock; then find /mnt/node_modules -mindepth 1 -maxdepth 1 -exec rm -rf {} +; cp -a /workspace/node_modules/. /mnt/node_modules/; fi'"
playwright_modules_init := "docker run --rm -v " + workspace_modules_volume + ":/mnt/node_modules " + playwright_image + " bash -c 'if ! cmp -s /workspace/node_modules/.toolchain-lock /mnt/node_modules/.toolchain-lock; then find /mnt/node_modules -mindepth 1 -maxdepth 1 -exec rm -rf {} +; cp -a /workspace/node_modules/. /mnt/node_modules/; fi'"
quality_modules_init := "docker run --rm -v " + workspace_modules_volume + ":/mnt/node_modules " + quality_image + " bash -c 'if ! cmp -s /workspace/node_modules/.toolchain-lock /mnt/node_modules/.toolchain-lock; then find /mnt/node_modules -mindepth 1 -maxdepth 1 -exec rm -rf {} +; cp -a /workspace/node_modules/. /mnt/node_modules/; fi'"
app := workspace_modules_init + " && " + compose + " run --rm -T dev bash -c"

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
    docker run --rm -v {{workspace_modules_volume}}:/mnt/node_modules {{tools_image}} bash -c 'if ! cmp -s /workspace/node_modules/.toolchain-lock /mnt/node_modules/.toolchain-lock; then find /mnt/node_modules -mindepth 1 -maxdepth 1 -exec rm -rf {} +; cp -a /workspace/node_modules/. /mnt/node_modules/; fi'
    docker run --rm -it -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace {{tools_image}} bash

check: dev-build
	{{workspace_modules_init}}
	docker run --rm -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace {{dev_image}} bash -c 'mise exec -- deno task quality:check:fast'

heavy-checks: dev-build
	{{app}} 'mise exec -- deno task database:schema-docs'
	{{app}} 'mise exec -- deno task heavy-checks'
	just build-check
	just e2e
	just accessibility
	just layout-check
	just visual-check
	just lighthouse
	just security-audit
	just complexity-report
	just repository-lint
	just reuse-check

sbom: quality-build
    mkdir -p .cache/sbom
    {{app}} 'mise exec -- deno task sbom:check'

sbom-image: runtime-build quality-build
    mkdir -p .cache/sbom
    docker run --rm -v "$PWD:/workspace" -v /var/run/docker.sock:/var/run/docker.sock -w /workspace -e SBOM_IMAGE={{app_image}} {{quality_image}} bash -c 'mise exec -- deno run --allow-read --allow-write --allow-env --allow-run=syft packages/pkg-tooling/src/tools/generate-sbom.tool.ts image && trivy sbom --config .config/trivy.yaml --scanners vuln --severity HIGH,CRITICAL --exit-code 1 .cache/sbom/image.cdx.json'

format:
    {{app}} 'mise exec -- deno task format'

format-check:
    {{app}} 'mise exec -- deno task check:format'

migration-format:
    {{app}} 'mise exec -- deno task db:format'

migration-format-check:
    {{app}} 'mise exec -- deno task db:format:check'

spelling:
    {{app}} 'mise exec -- deno task cspell'

stylelint:
    {{app}} 'mise exec -- deno task stylelint'

quality-report: quality-build
    mkdir -p .cache
    docker run --rm -v "$PWD:/workspace" -w /workspace -e SOURCE_COMMIT="{{env_var_or_default('SOURCE_COMMIT', 'local-uncommitted')}}" -e TOOLCHAIN_IMAGE="{{quality_image}}" -e REPORT_SCOPE=quality-report {{quality_image}} bash -c 'mkdir -p .cache && (aqua exec -- qlty check --all --no-cache --no-upgrade-check --no-progress --no-fail --sarif > .cache/qlty-report.sarif || test -s .cache/qlty-report.sarif) && mise exec -- deno task quality:report:metadata'

aqua-checksums-check: quality-build
    {{app}} 'mise exec -- deno task aqua:checksums:check'

aqua-checksums-update: quality-build
    {{app}} 'mise exec -- deno task aqua:checksums:update'

docs-links:
    {{app}} 'mise exec -- deno task docs:links'

commit-check:
    {{app}} 'mise exec -- deno task commit:check'

lint:
    {{app}} 'mise exec -- deno task check:lint'

typecheck:
    {{app}} 'mise exec -- deno task typecheck'

ast-grep:
    {{app}} 'mise exec -- deno task ast-grep'

comments:
    {{app}} 'mise exec -- deno task comments'

test:
    {{app}} 'mise exec -- deno task test'

architecture:
    {{app}} 'mise exec -- deno task architecture:check'

content:
    {{app}} 'mise exec -- deno task content:validate'

content-migrate: dev-build
    {{app}} 'mise exec -- deno task db:migrate'

content-migration-status: dev-build
    {{app}} 'mise exec -- deno task db:status'

schema-docs: dev-build
    {{app}} 'mise exec -- deno task database:schema-docs'

security:
    {{app}} 'mise exec -- deno task security:check'

build:
    just runtime-build

build-check:
    {{bake}} build-check

e2e: runtime-build playwright-build
    #!/usr/bin/env bash
    set -euo pipefail
    docker volume create {{workspace_modules_volume}} >/dev/null
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    {{playwright_modules_init}}
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno task e2e'

accessibility: runtime-build playwright-build
    #!/usr/bin/env bash
    set -euo pipefail
    docker volume create {{workspace_modules_volume}} >/dev/null
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    {{playwright_modules_init}}
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno task e2e -- packages/app/tests/e2e/accessibility.spec.ts'

layout-check: runtime-build playwright-build
	#!/usr/bin/env bash
	set -euo pipefail
	docker volume create {{workspace_modules_volume}} >/dev/null
	{{compose}} up -d web
	trap '{{compose}} down' EXIT
	{{playwright_modules_init}}
	docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno task layout:check'

visual-check: runtime-build playwright-build
	#!/usr/bin/env bash
	set -euo pipefail
	docker volume create {{workspace_modules_volume}} >/dev/null
	{{compose}} up -d web
	trap '{{compose}} down' EXIT
	{{playwright_modules_init}}
	docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno task visual:check'

visual-update: runtime-build playwright-build
	#!/usr/bin/env bash
	set -euo pipefail
	docker volume create {{workspace_modules_volume}} >/dev/null
	{{compose}} up -d web
	trap '{{compose}} down' EXIT
	{{playwright_modules_init}}
	docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e PLAYWRIGHT_BASE_URL=http://web -e PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium {{playwright_image}} bash -c 'mise exec -- deno task visual:update'

lighthouse: runtime-build quality-build
    #!/usr/bin/env bash
    set -euo pipefail
    docker volume create {{workspace_modules_volume}} >/dev/null
    {{compose}} up -d web
    trap '{{compose}} down' EXIT
    {{quality_modules_init}}
    docker run --rm --network portal-guesant-saberes_default -v "$PWD:/workspace" -v {{workspace_modules_volume}}:/workspace/node_modules -v "$PWD/.cache/deno:/deno/cache" -w /workspace -e LHCI_BUILD_CONTEXT__CURRENT_HASH=local {{quality_image}} bash -c 'mise exec -- deno task lighthouse'

ci: check

repository-lint: quality-build
    docker run --rm -v "$PWD:/workspace:ro" {{quality_image}} bash -c 'aqua exec -- yamllint -c .config/.yamllint.yml .github .config .local && aqua exec -- hadolint --config .config/.hadolint.yaml .config/container/Dockerfile && for workflow in .github/workflows/*.yml; do aqua exec -- actionlint -color "$workflow"; done && aqua exec -- zizmor .github/workflows'

reuse-check: quality-build
    docker run --rm -v "$PWD:/workspace:ro" {{quality_image}} bash -c 'reuse lint'

security-audit: quality-build
    docker run --rm -v "$PWD:/repo:ro" -v portal-guesant-saberes-trivy-cache:/root/.cache/trivy {{quality_image}} bash -c 'aqua exec -- gitleaks dir --no-banner --redact --config /repo/.config/.gitleaks.toml /repo && aqua exec -- osv-scanner scan source --config /repo/.config/osv-scanner.toml --recursive /repo && aqua exec -- trivy fs --config /repo/.config/trivy.yaml --ignorefile="" --secret-config="" /repo && semgrep scan --config auto --error --exclude-rule dockerfile.security.missing-user-entrypoint.missing-user-entrypoint --exclude-rule dockerfile.security.missing-user.missing-user --exclude-rule generic.nginx.security.header-redefinition.header-redefinition --exclude-rule html.security.audit.missing-integrity.missing-integrity --exclude node_modules --exclude dist /repo/packages /repo/.local/operator /repo/.config'

complexity-report: quality-build
    mkdir -p .cache
    docker run --rm -v "$PWD:/workspace" -w /workspace {{quality_image}} bash -c 'lizard -l typescript -C 5 -L 35 -a 3 packages .local/operator | tee .cache/lizard.txt'
