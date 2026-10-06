import { createContentKey } from "./create-content-key.function";
import type { ContentKey } from "./content-key.type";
import type { ContentReference } from "./content-reference.type";

export function getContentReferenceKey(reference: ContentReference | undefined): ContentKey | undefined {
  if (!reference) {
    return undefined;
  }

  return createContentKey(reference);
}
