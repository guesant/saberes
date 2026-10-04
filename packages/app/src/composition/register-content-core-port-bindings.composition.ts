import {
  SqlJsGetAssessmentAdapter,
  SqlJsGetCatalogAdapter,
  SqlJsGetCourseAdapter,
  SqlJsGetContentReleaseAdapter,
  SqlJsGetLessonAdapter,
  SqlJsGetQuestionAdapter,
  type ContentRepositoryContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function registerContentCorePortBindings(container: Container): void {
  const getContentRepository = (): ContentRepositoryContract => {
    return resolvePort<ContentRepositoryContract>(
      container,
      applicationDependencyTokens.contentRepository,
    );
  };

  const bindings: PortFactoryBinding[] = [
    [
      applicationDependencyTokens.getCatalog,
      () => { return new SqlJsGetCatalogAdapter(getContentRepository()); },
    ],
    [
      applicationDependencyTokens.getCourse,
      () => { return new SqlJsGetCourseAdapter(getContentRepository()); },
    ],
    [
      applicationDependencyTokens.getLesson,
      () => { return new SqlJsGetLessonAdapter(getContentRepository()); },
    ],
    [
      applicationDependencyTokens.getQuestion,
      () => { return new SqlJsGetQuestionAdapter(getContentRepository()); },
    ],
    [
      applicationDependencyTokens.getAssessment,
      () => { return new SqlJsGetAssessmentAdapter(getContentRepository()); },
    ],
    [
      applicationDependencyTokens.getContentRelease,
      () => { return new SqlJsGetContentReleaseAdapter(getContentRepository()); },
    ],
  ];

  registerPortFactories(container, bindings);
}
