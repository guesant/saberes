import type { PersonalProgressLink } from "./personal-progress-link.interface";

export function findPersonalProgressLink(
  links: PersonalProgressLink[],
  contentKey: string,
): PersonalProgressLink | undefined {
  return links.find((link) => {return link.contentKey === contentKey;});
}
