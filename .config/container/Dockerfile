# syntax=docker/dockerfile:1.10

ARG DENO_BASE=debian:trixie-slim@sha256:a99cfc517144bc59b1978475ec53b46ecabec7e43635402ee5b77cc54cd1b20a

FROM ${DENO_BASE} AS quality

ARG TARGETARCH
ARG MISE_VERSION=2026.10.0
ARG MISE_SHA256_AMD64=57ced973f968b8fbab07aa8e32bd7077d4a357e200a22356d98963c723c6de0a
ARG MISE_SHA256_ARM64=4b8cacffac83e8493fc5d1eef25f6365edba73ccbed5a1f3987b7cb3f5079656
ARG MISE_LOCKED=1
ARG AQUA_VERSION=2.63.0
ARG AQUA_SHA256_AMD64=5d2ea870fb45847e67128af128f8a2f974c7f3a0e7bf9f880015562b9064bb9b
ARG AQUA_SHA256_ARM64=3dd441af09e988c63d2d6a36f391a0609fd35ca95f548038f02471de6a0bdef1
ARG SCHEMASPY_VERSION=7.0.2
ARG SQLITE_JDBC_VERSION=3.53.4.0
ARG SCHEMASPY_SHA512=f8a256ed73928ab5a23ac26ea722e881e530af098f5014998b4bbd17c20980d996e39137153504f581346abd07c3556c850bb1efa55c908e319059b1e23878e5
ARG SQLITE_JDBC_SHA256=bcb1f51e36f940867e83342f9efbf5968ac44a6bef4d397bb4af7b17b45cd2fb
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
        openjdk-21-jre \
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
    aqua install

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

WORKDIR /var/cache/portal-schema-tools

RUN --mount=type=cache,id=portal-guesant-saberes-schema-tools,target=/var/cache/portal-schema-tools \
    set -eux; \
    mkdir -p /opt/schemaspy /var/cache/portal-schema-tools; \
    curl --fail --silent --show-error --location --output schemaspy-app.jar \
        "https://github.com/schemaspy/schemaspy/releases/download/v${SCHEMASPY_VERSION}/schemaspy-app.jar"; \
    printf '%s  %s\n' "${SCHEMASPY_SHA512}" schemaspy-app.jar | sha512sum --check --status -; \
    curl --fail --silent --show-error --location --output sqlite-jdbc.jar \
        "https://repo1.maven.org/maven2/org/xerial/sqlite-jdbc/${SQLITE_JDBC_VERSION}/sqlite-jdbc-${SQLITE_JDBC_VERSION}.jar"; \
    printf '%s  %s\n' "${SQLITE_JDBC_SHA256}" sqlite-jdbc.jar | sha256sum --check --status -; \
    install --mode 0644 schemaspy-app.jar /opt/schemaspy/schemaspy.jar; \
    install --mode 0644 sqlite-jdbc.jar /opt/schemaspy/sqlite-jdbc.jar

WORKDIR /workspace

COPY package.json deno.json deno.lock biome.json ./
COPY packages ./packages
COPY .config ./.config
COPY .tools ./.tools
COPY .github ./.github
COPY README.md ./README.md
COPY docs ./docs
COPY justfile ./justfile

RUN --mount=type=cache,id=portal-guesant-saberes-deno,target=/deno/cache \
    mise exec -- deno install --frozen --node-modules-dir=auto

ENV SCHEMASPY_JAR=/opt/schemaspy/schemaspy.jar \
    SQLITE_JDBC_JAR=/opt/schemaspy/sqlite-jdbc.jar

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

RUN mise exec -- deno run --allow-read --allow-env .tools/check-build.ts

FROM nginx:1.29-alpine@sha256:5616878291a2eed594aee8db4dade5878cf7edcb475e59193904b198d9b830de AS runtime

COPY .config/container/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=app-build /workspace/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
