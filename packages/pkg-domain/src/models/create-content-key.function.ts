import type { ContentKey } from "./content-key.type";
import type { ContentReference } from "./content-reference.type";

export function createContentKey(reference: ContentReference): ContentKey {
  return `${reference.type}:${reference.id}`;
}
