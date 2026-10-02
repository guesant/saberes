import type { AppDependencies } from "@guesant/saberes-core";
import { createGetCatalogUseCase } from "./use-cases/getCatalog";
import { createGetCourseUseCase } from "./use-cases/getCourse";
import { createGetLessonUseCase } from "./use-cases/getLesson";
import { createGetQuestionUseCase } from "./use-cases/getQuestion";
import { createGetStudyPlanUseCase } from "./use-cases/getStudyPlan";
import { createGetTopicMapUseCase } from "./use-cases/getTopicMap";

export function createUseCases(dependencies: AppDependencies) {
    return {
        getCatalog: createGetCatalogUseCase(dependencies.content),
        getCourse: createGetCourseUseCase(dependencies.content),
        getLesson: createGetLessonUseCase(dependencies.content),
        getQuestion: createGetQuestionUseCase(dependencies.content),
        getStudyPlan: createGetStudyPlanUseCase(dependencies.content),
        getTopicMap: createGetTopicMapUseCase(dependencies.content),
    };
}

export type AppUseCases = ReturnType<typeof createUseCases>;
