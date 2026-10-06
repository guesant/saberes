import { parseContentReference } from "./parse-content-reference.function";
import type { ContentKey } from "./content-key.type";
import type { ContentReference } from "./content-reference.type";

export function createContentReference(key: ContentKey): ContentReference {
  const reference = parseContentReference(key);

  if (!reference) {
    throw new Error(`Unsupported content reference: ${key}`);
  }

  return reference;
}
