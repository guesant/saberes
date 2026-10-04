import type { NavigationLink } from "./navigation-link.interface";

const mobileNavigationPaths = [
  "/meu-estudo",
  "/catalogo",
  "/revisoes",
  "/desempenho",
  "/meu-espaco",
];

export function getMobileNavigationLinks(links: NavigationLink[]): NavigationLink[] {
  const mobileLinks: NavigationLink[] = [];

  for (const path of mobileNavigationPaths) {
    const link = links.find((item) => {
      return item.to === path;
    });

    if (link) {
      mobileLinks.push(link);
    }
  }

  return mobileLinks;
}
