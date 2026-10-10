import { describe, expect, it } from "vitest";
import type { TopicResourceReadModel } from "@guesant/saberes-application";
import { getTopicResourceDescription } from "./get-topic-resource-description.function";

const translate = (key: string) => key;

describe("getTopicResourceDescription", () => {
  it("does not repeat an identical editorial note stored on the resource and topic relation", () => {
    const note = "Reviewed resource caveat";
    const resource: TopicResourceReadModel = {
      id: 548,
      title: "Permutations and combinations",
      description: "Counting theory supplement",
      url: "https://example.test/resource",
      kind: "article",
      provider: "Example",
      isExternal: true,
      editorialNote: note,
      relationNote: note,
    };

    const result = getTopicResourceDescription(resource, translate);

    expect(result.split(note)).toHaveLength(2);
  });

  it("keeps distinct resource and relation notes", () => {
    const resource: TopicResourceReadModel = {
      id: 548,
      title: "Permutations and combinations",
      description: "Counting theory supplement",
      url: "https://example.test/resource",
      kind: "article",
      provider: "Example",
      isExternal: true,
      editorialNote: "Article scope caveat",
      relationNote: "Relevant to counting, not probability",
    };

    const result = getTopicResourceDescription(resource, translate);

    expect(result).toContain("Article scope caveat");
    expect(result).toContain("Relevant to counting, not probability");
  });
});
