# syntax=docker/dockerfile:1.10

ARG DENO_BASE=denoland/deno:2.9.7@sha256:fa335acdf6b72106eda2cb6a8cb5f4187e7630e357467489db4b2e7352d5e432

FROM ${DENO_BASE} AS quality

ARG TARGETARCH
ARG GITLEAKS_VERSION=8.28.0
ARG OSV_SCANNER_VERSION=2.0.2
ARG TRIVY_VERSION=0.75.0
ARG ACTIONLINT_VERSION=1.7.9
ARG HADOLINT_VERSION=2.14.0
ARG LYCHEE_VERSION=0.20.1
ARG DBMATE_VERSION=2.36.0
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown
ARG VERSION=dev

ENV DENO_DIR=/deno/cache \
    DENO_NO_PROMPT=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PATH=/opt/quality-venv/bin:/workspace/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# The canonical tools image is invoked by Compose, Just and CI commands directly.
# Reset the upstream Deno image entrypoint so `deno`, `bash` and tool binaries
# have identical semantics in development, build and workflows.
ENTRYPOINT []

WORKDIR /workspace
USER root

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        bash \
        ca-certificates \
        chromium \
        curl \
        git \
        jq \
        python3 \
        python3-pip \
        python3-venv \
        shellcheck \
        unzip \
        xz-utils \
    && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,id=portal-guesant-saberes-pip,target=/root/.cache/pip \
    python3 -m venv /opt/quality-venv \
    && /opt/quality-venv/bin/pip install \
        setuptools==80.9.0 \
        lizard==1.17.19 \
        reuse==5.1.1 \
        semgrep==1.133.0 \
        yamllint==1.37.1 \
        zizmor==1.11.0

RUN --mount=type=cache,id=portal-guesant-saberes-quality-tools,target=/var/cache/portal-tools \
    set -eux; \
    case "${TARGETARCH}" in \
        amd64) \
            gitleaks_asset="gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"; \
            actionlint_asset="actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz"; \
            hadolint_asset="hadolint-linux-x86_64"; \
            lychee_asset="lychee-x86_64-unknown-linux-gnu.tar.gz"; \
            trivy_asset="trivy_${TRIVY_VERSION}_Linux-64bit.tar.gz"; \
            trivy_sha="c6e65abddb348e25f10549df887045629cf28cc72453cd1c63acb717316b3f3f"; \
            dbmate_sha="47e284b3d8cbad1ba5f090495aa05afd1bbd5f35e2ed5577aad06da74ce780ce"; \
            ;; \
        arm64) \
            gitleaks_asset="gitleaks_${GITLEAKS_VERSION}_linux_arm64.tar.gz"; \
            actionlint_asset="actionlint_${ACTIONLINT_VERSION}_linux_arm64.tar.gz"; \
            hadolint_asset="hadolint-linux-arm64"; \
            lychee_asset="lychee-aarch64-unknown-linux-gnu.tar.gz"; \
            trivy_asset="trivy_${TRIVY_VERSION}_Linux-ARM64.tar.gz"; \
            trivy_sha="a1ee9f6ffb7d112b64ff726a2a0717c21175c1114361391f4a132956751a13b3"; \
            dbmate_sha="c7d49db4b54e487eddf8ce7d6e88f4035e1eb04c7edb16008f668cdfad2f29e8"; \
            ;; \
        *) echo "Arquitetura não suportada: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    cd /var/cache/portal-tools; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_checksums.txt"; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${gitleaks_asset}"; \
    grep " ${gitleaks_asset}$" "gitleaks_${GITLEAKS_VERSION}_checksums.txt" | sha256sum --check --status -; \
    tar --extract --gzip --file "${gitleaks_asset}" gitleaks; \
    install --mode 0755 gitleaks /usr/local/bin/gitleaks; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/actionlint_${ACTIONLINT_VERSION}_checksums.txt"; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/${actionlint_asset}"; \
    grep " ${actionlint_asset}$" "actionlint_${ACTIONLINT_VERSION}_checksums.txt" | sha256sum --check --status -; \
    tar --extract --gzip --file "${actionlint_asset}" actionlint; \
    install --mode 0755 actionlint /usr/local/bin/actionlint; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/hadolint/hadolint/releases/download/v${HADOLINT_VERSION}/${hadolint_asset}"; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/hadolint/hadolint/releases/download/v${HADOLINT_VERSION}/${hadolint_asset}.sha256"; \
    sha256sum --check "${hadolint_asset}.sha256"; \
    install --mode 0755 "${hadolint_asset}" /usr/local/bin/hadolint; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/google/osv-scanner/releases/download/v${OSV_SCANNER_VERSION}/osv-scanner_SHA256SUMS"; \
    osv_asset="osv-scanner_linux_${TARGETARCH}"; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/google/osv-scanner/releases/download/v${OSV_SCANNER_VERSION}/${osv_asset}"; \
    grep " ${osv_asset}$" osv-scanner_SHA256SUMS | sha256sum --check --status -; \
    install --mode 0755 "${osv_asset}" /usr/local/bin/osv-scanner; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/${trivy_asset}"; \
    printf '%s  %s\n' "${trivy_sha}" "${trivy_asset}" | sha256sum --check --status -; \
    tar --extract --gzip --file "${trivy_asset}" trivy; \
    install --mode 0755 trivy /usr/local/bin/trivy; \
    dbmate_asset="dbmate-linux-${TARGETARCH}"; \
    curl --fail --silent --show-error --location --output "${dbmate_asset}" "https://github.com/amacneil/dbmate/releases/download/v${DBMATE_VERSION}/${dbmate_asset}"; \
    printf '%s  %s\n' "${dbmate_sha}" "${dbmate_asset}" | sha256sum --check --status -; \
    install --mode 0755 "${dbmate_asset}" /usr/local/bin/dbmate; \
    curl --fail --silent --show-error --location --remote-name "https://github.com/lycheeverse/lychee/releases/download/lychee-v${LYCHEE_VERSION}/${lychee_asset}"; \
    case "${TARGETARCH}" in \
        amd64) lychee_sha="1dd08bb064e2114c2c9d0c9009f51577de24e805361d6332162807972d8e9474" ;; \
        arm64) lychee_sha="d9c1221b5e349962fdfea74535440242a6483dc4d9a5f886763fc1d0c3d4bf07" ;; \
    esac; \
    printf '%s  %s\n' "${lychee_sha}" "${lychee_asset}" | sha256sum --check --status -; \
    tar --extract --gzip --file "${lychee_asset}" lychee; \
    install --mode 0755 lychee /usr/local/bin/lychee

COPY package.json deno.json deno.lock biome.json ./
COPY packages ./packages
COPY .config ./.config
COPY .tools ./.tools
COPY README.md ./README.md
COPY docs ./docs

RUN --mount=type=cache,id=portal-guesant-saberes-deno,target=/deno/cache \
    deno install --frozen --node-modules-dir=auto

LABEL org.opencontainers.image.title="Portal Guesant Saberes unified Deno toolchain" \
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

RUN deno task build

FROM app-build AS build-check

RUN deno run --allow-read --allow-env .tools/check-build.ts

FROM nginx:1.29-alpine@sha256:5616878291a2eed594aee8db4dade5878cf7edcb475e59193904b198d9b830de AS runtime

COPY .container/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=app-build /workspace/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
