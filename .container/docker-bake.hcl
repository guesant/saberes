variable "TOOLS_IMAGE" {
  default = "portal-guesant-saberes-tools:local"
}

variable "DEV_IMAGE" {
  default = "portal-guesant-saberes-dev:local"
}

variable "QUALITY_IMAGE" {
  default = "portal-guesant-saberes-quality:local"
}

variable "QUALITY_CI_IMAGE" {
  default = "portal-guesant-saberes-quality-ci:local"
}

variable "PLAYWRIGHT_IMAGE" {
  default = "portal-guesant-saberes-playwright:local"
}

variable "APP_IMAGE" {
  default = "portal-guesant-saberes-app:local"
}

variable "CACHE_FROM" {
  default = "type=local,src=.cache/buildx-tools"
}

variable "CACHE_TO" {
  default = "type=local,dest=.cache/buildx-tools,mode=max"
}

variable "VCS_REF" {
  default = "unknown"
}

variable "BUILD_DATE" {
  default = "unknown"
}

variable "VERSION" {
  default = "dev"
}

variable "VITE_BASE_PATH" {
  default = "/"
}

variable "VITE_CONTENT_DB_URL" {
  default = ""
}

target "_common" {
  context = "."
  dockerfile = ".container/Dockerfile"
  args = {
    VCS_REF = VCS_REF
    BUILD_DATE = BUILD_DATE
    VERSION = VERSION
  }
  cache-from = [CACHE_FROM]
  cache-to = [CACHE_TO]
  labels = {
    "org.opencontainers.image.title" = "Portal Guesant Saberes unified toolchain"
    "org.opencontainers.image.revision" = VCS_REF
    "org.opencontainers.image.version" = VERSION
  }
}

target "tools" {
  inherits = ["_common"]
  target = "tools"
  tags = [TOOLS_IMAGE]
}

target "dev" {
  inherits = ["_common"]
  target = "dev"
  tags = [DEV_IMAGE]
}

target "quality" {
  inherits = ["_common"]
  target = "quality"
  tags = [QUALITY_IMAGE]
}

target "quality-ci" {
  inherits = ["_common"]
  target = "quality-ci"
  tags = [QUALITY_CI_IMAGE]
}

target "playwright" {
  inherits = ["_common"]
  target = "playwright"
  tags = [PLAYWRIGHT_IMAGE]
}

target "runtime" {
  inherits = ["_common"]
  target = "runtime"
  tags = [APP_IMAGE]
  args = {
    VITE_BASE_PATH = VITE_BASE_PATH
    VITE_CONTENT_DB_URL = VITE_CONTENT_DB_URL
  }
}

target "build-check" {
  inherits = ["_common"]
  target = "build-check"
  args = {
    VITE_BASE_PATH = VITE_BASE_PATH
    VITE_CONTENT_DB_URL = VITE_CONTENT_DB_URL
  }
}

group "default" {
  targets = ["tools", "dev", "quality", "quality-ci", "playwright", "build-check", "runtime"]
}
