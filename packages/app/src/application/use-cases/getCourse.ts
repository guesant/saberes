import type { ContentPort } from "@guesant/saberes-core";

export function createGetCourseUseCase(content: ContentPort) {
    return (slug: string) => content.getCourse(slug);
}
