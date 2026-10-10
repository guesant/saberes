export function getOfficialStudyAssetUrl(suffix: string): string {
  const base = import.meta.env.BASE_URL;

  return new URL(`${base}${suffix.replace(/^\/+/, "")}`, window.location.origin).href;
}
