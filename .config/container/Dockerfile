# syntax=docker/dockerfile:1.10

# renovate: datasource=docker depName=debian
ARG DENO_BASE=debian:trixie-slim@sha256:a99cfc517144bc59b1978475ec53b46ecabec7e43635402ee5b77cc54cd1b20a

FROM ${DENO_BASE} AS quality

ARG TARGETARCH
# renovate: datasource=github-releases depName=jdx/mise
ARG MISE_VERSION=2026.10.0
ARG MISE_SHA256_AMD64=57ced973f968b8fbab07aa8e32bd7077d4a357e200a22356d98963c723c6de0a
ARG MISE_SHA256_ARM64=4b8cacffac83e8493fc5d1eef25f6365edba73ccbed5a1f3987b7cb3f5079656
ARG MISE_LOCKED=1
# renovate: datasource=github-releases depName=aquaproj/aqua
ARG AQUA_VERSION=2.63.0
ARG AQUA_SHA256_AMD64=5d2ea870fb45847e67128af128f8a2f974c7f3a0e7bf9f880015562b9064bb9b
ARG AQUA_SHA256_ARM64=3dd441af09e988c63d2d6a36f391a0609fd35ca95f548038f02471de6a0bdef1
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown
ARG VERSION=dev

ENV DENO_DIR=/deno/cache \
    DENO_NO_PROMPT=1 \
    MISE_DATA_DIR=/opt/mise \
    MISE_CACHE_DIR=/var/cache/mise \
    MISE_YES=1 \
    MISE_LOCKED=${MISE_LOCKED} \
    MISE_CONFIG_FILE=/workspace/.config/mise/mise.toml \
    AQUA_ROOT_DIR=/opt/aqua \
    AQUA_CONFIG=/workspace/.config/aqua/aqua.yaml \
    AQUA_POLICY_CONFIG=/workspace/.config/aqua/aqua-policy.yaml \
    AQUA_ENFORCE_CHECKSUM=true \
    AQUA_ENFORCE_REQUIRE_CHECKSUM=true \
    UV_TOOL_DIR=/opt/aqua/uv-tools \
    UV_TOOL_BIN_DIR=/opt/aqua/bin \
    UV_CACHE_DIR=/var/cache/uv \
    PATH=/opt/mise/shims:/opt/mise/bin:/opt/aqua/bin:/workspace/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ENTRYPOINT []

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /workspace

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        bash \
        ca-certificates \
        chromium \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

COPY .config/aqua ./.config/aqua
COPY .config/mise ./.config/mise

RUN --mount=type=cache,id=portal-guesant-saberes-mise-bootstrap,target=/var/cache/mise-bootstrap \
    set -eux; \
    case "${TARGETARCH}" in \
        amd64) mise_asset_arch="x64"; mise_sha256="${MISE_SHA256_AMD64}" ;; \
        arm64) mise_asset_arch="arm64"; mise_sha256="${MISE_SHA256_ARM64}" ;; \
        *) echo "Arquitetura não suportada: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl --fail --silent --show-error --location --output /var/cache/mise-bootstrap/mise \
        "https://github.com/jdx/mise/releases/download/v${MISE_VERSION}/mise-v${MISE_VERSION}-linux-${mise_asset_arch}"; \
    printf '%s  %s\n' "${mise_sha256}" /var/cache/mise-bootstrap/mise | sha256sum --check --status -; \
    install --mode 0755 /var/cache/mise-bootstrap/mise /usr/local/bin/mise; \
    mkdir --parents /opt/mise/shims /opt/mise/bin /var/cache/mise; \
    mise install --locked

RUN --mount=type=cache,id=portal-guesant-saberes-aqua-bootstrap,target=/var/cache/aqua-bootstrap \
    set -eux; \
    case "${TARGETARCH}" in \
        amd64) aqua_sha256="${AQUA_SHA256_AMD64}" ;; \
        arm64) aqua_sha256="${AQUA_SHA256_ARM64}" ;; \
        *) echo "Arquitetura não suportada: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl --fail --silent --show-error --location --output /var/cache/aqua-bootstrap/aqua.tar.gz \
        "https://github.com/aquaproj/aqua/releases/download/v${AQUA_VERSION}/aqua_linux_${TARGETARCH}.tar.gz"; \
    printf '%s  %s\n' "${aqua_sha256}" /var/cache/aqua-bootstrap/aqua.tar.gz | sha256sum --check --status -; \
    tar --extract --gzip --file /var/cache/aqua-bootstrap/aqua.tar.gz --directory /var/cache/aqua-bootstrap; \
    install --mode 0755 /var/cache/aqua-bootstrap/aqua /usr/local/bin/aqua; \
    mkdir --parents "${AQUA_ROOT_DIR}/bin"; \
    aqua install; \
    mkdir --parents "${AQUA_ROOT_DIR}/jars"; \
    schemaspy_jar_path="$(find "${AQUA_ROOT_DIR}/pkgs" -type f -name schemaspy-app.jar -print -quit)"; \
    sqlite_jdbc_jar_path="$(find "${AQUA_ROOT_DIR}/pkgs" -type f -name 'sqlite-jdbc-*.jar' -print -quit)"; \
    test -n "${schemaspy_jar_path}"; \
    test -n "${sqlite_jdbc_jar_path}"; \
    ln --symbolic --force "${schemaspy_jar_path}" "${AQUA_ROOT_DIR}/jars/schemaspy.jar"; \
    ln --symbolic --force "${sqlite_jdbc_jar_path}" "${AQUA_ROOT_DIR}/jars/sqlite-jdbc.jar"

COPY .config/aqua/python-tools.txt ./.config/aqua/python-tools.txt

RUN --mount=type=cache,id=portal-guesant-saberes-python-tools,target=/var/cache/uv \
    set -eux; \
    python_bin="$(mise which python)"; \
    while IFS= read -r package || [ -n "${package}" ]; do \
        case "${package}" in ''|'#'*) continue ;; esac; \
        case "${package}" in \
            semgrep==*) mise exec -- uv tool install --python "${python_bin}" --force --with 'setuptools<82' "${package}" ;; \
            *) mise exec -- uv tool install --python "${python_bin}" --force "${package}" ;; \
        esac; \
    done < .config/aqua/python-tools.txt

WORKDIR /workspace

COPY package.json deno.json deno.lock ./
COPY packages ./packages
COPY .config ./.config
COPY .github ./.github
COPY README.md ./README.md
COPY docs ./docs
COPY justfile ./justfile

RUN --mount=type=cache,id=portal-guesant-saberes-deno,target=/deno/cache \
    mise exec -- deno install --frozen --node-modules-dir=auto

ENV SCHEMASPY_JAR=/opt/aqua/jars/schemaspy.jar \
    SQLITE_JDBC_JAR=/opt/aqua/jars/sqlite-jdbc.jar

LABEL org.opencontainers.image.title="Portal Guesant Saberes unified mise and Aqua toolchain" \
      org.opencontainers.image.source="https://github.com/guesant/saberes" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}"

FROM quality AS tools
CMD ["bash"]

FROM quality AS dev
CMD ["bash"]

FROM quality AS quality-ci
CMD ["bash"]

FROM quality AS playwright
ENV PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium
CMD ["bash"]

FROM quality AS app-build

ARG VITE_BASE_PATH=/
ARG VITE_CONTENT_DB_URL=
ENV VITE_BASE_PATH=${VITE_BASE_PATH} \
    VITE_CONTENT_DB_URL=${VITE_CONTENT_DB_URL}

RUN mise exec -- deno task build

FROM app-build AS build-check

RUN mise exec -- deno run --allow-read --allow-env packages/pkg-tooling/src/tools/check-build.tool.ts

FROM nginx:1.29-alpine@sha256:5616878291a2eed594aee8db4dade5878cf7edcb475e59193904b198d9b830de AS runtime

COPY .config/container/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=app-build /workspace/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
