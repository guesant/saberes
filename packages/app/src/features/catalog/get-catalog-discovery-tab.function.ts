export function getCatalogDiscoveryTab(mode: string | null): number {
  if (mode === "praticar") {
    return 3;
  }

  return 0;
}
