import type { PersonalReferenceSourceKind } from "./personal-reference-source-kind.type";

export function getPersonalReferenceSourceKind(source: string): PersonalReferenceSourceKind {
  try {
    const url = new URL(source.trim());

    if (url.protocol === "http:" || url.protocol === "https:") {
      return "external";
    }
  } catch {
    return "local";
  }

  return "local";
}
