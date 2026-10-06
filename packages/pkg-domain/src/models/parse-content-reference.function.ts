import type { ContentReference } from "./content-reference.type";

export function parseContentReference(value: unknown): ContentReference | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const separator = value.indexOf(":");

  if (separator < 1 || separator === value.length - 1) {
    return undefined;
  }

  const type = value.slice(0, separator);

  const id = value.slice(separator + 1);

  switch (type) {
    case "course":
      return { type, id };

    case "lesson":
      return { type, id };

    case "topic":
      return { type, id };

    case "question":
      return { type, id };

    case "exercise":
      return { type, id };

    case "plan":
      return { type, id };

    case "assessment":
      return { type, id };

    default:
      return undefined;
  }
}
