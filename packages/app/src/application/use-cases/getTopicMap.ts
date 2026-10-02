import type { ContentPort } from "@guesant/saberes-core";

export function createGetTopicMapUseCase(content: ContentPort) {
    return (mapKey: string) => content.getTopicMap(mapKey);
}
