import type { ContentPort } from "@guesant/saberes-core";

export function createGetQuestionUseCase(content: ContentPort) {
    return (key: string) => content.getQuestion(key);
}
