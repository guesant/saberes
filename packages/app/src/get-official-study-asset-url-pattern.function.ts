// Workbox serializes route callbacks without their surrounding Vite variables.
// An unanchored URL pattern also keeps Workbox's same-origin-only matching.
export const OFFICIAL_STUDY_ASSETS_CACHE_NAME = "saberes-official-study-assets";

export function getOfficialStudyAssetUrlPattern(base: string): RegExp {
  const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

  return new RegExp(`${escapedBase}data/[^?#]+\\.(?:pdf|png|jpe?g)(?:\\?[^#]*)?$`, "iu");
}
