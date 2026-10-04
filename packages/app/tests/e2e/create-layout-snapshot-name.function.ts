export function createLayoutSnapshotName(route: string, viewport: string): string {
  const routeName = route === "/" ? "home" : route.replaceAll("/", "-")
    .replace(/^-/, "");

  return `${routeName}-${viewport}.png`;
}
