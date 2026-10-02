import type { ContentPort } from "@guesant/saberes-core";

export function createGetLessonUseCase(content: ContentPort) {
    return (key: string) => content.getLesson(key);
}
