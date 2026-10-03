import {
  SqlJsGetAssessmentAdapter,
  SqlJsGetCatalogAdapter,
  SqlJsGetCourseAdapter,
  SqlJsGetLessonAdapter,
  SqlJsGetQuestionAdapter,
  SqlJsGetStudyPlanAdapter,
  SqlJsGetTopicMapAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { GraphologyBuildKnowledgeGraphAdapter } from "@guesant/saberes-adapter-graphology-v1";
import { ValibotParseEditorialBlocksAdapter } from "@guesant/saberes-adapter-validation-v1";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createContentDependencies(): Partial<ApplicationPorts> {
  return {
    getCatalog: new SqlJsGetCatalogAdapter(),
    getCourse: new SqlJsGetCourseAdapter(),
    getLesson: new SqlJsGetLessonAdapter(),
    getQuestion: new SqlJsGetQuestionAdapter(),
    getAssessment: new SqlJsGetAssessmentAdapter(),
    getTopicMap: new SqlJsGetTopicMapAdapter(),
    getStudyPlan: new SqlJsGetStudyPlanAdapter(),
    parseEditorialBlocks: new ValibotParseEditorialBlocksAdapter(),
    buildKnowledgeGraph: new GraphologyBuildKnowledgeGraphAdapter(),
  };
}
