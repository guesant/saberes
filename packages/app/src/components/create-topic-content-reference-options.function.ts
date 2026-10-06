import type { TopicMapReadModel } from "@guesant/saberes-application";
import type { AutocompleteOption } from "@guesant/saberes-ui";

export function createTopicContentReferenceOptions(maps: Array<TopicMapReadModel | null>): AutocompleteOption[] {
  return maps.flatMap((map) => {
    if (!map) {
      return [];
    }

    return map.nodes.flatMap((node) => {
      const slug = String(node.slug ?? "");

      const title = String(node.label ?? "");

      if (!slug || !title) {
        return [];
      }

      return [{ label: `Tópico · ${title}`, value: `topic:${slug}` }];
    });
  });
}
