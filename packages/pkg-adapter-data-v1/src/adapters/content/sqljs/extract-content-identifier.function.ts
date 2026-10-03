import type { ContentKey } from "@guesant/saberes-application";

export function getContentIdentifier(key: ContentKey | string) {
  return String(key).replace(/^[a-z]+:/, "");
}
