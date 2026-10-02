import type { ContentPort } from "@guesant/saberes-core";

export function createGetStudyPlanUseCase(content: ContentPort) {
    return (slug?: string) => content.getStudyPlan(slug);
}
