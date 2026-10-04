import {
  type ProgressStorageContract,
  GetSessionAdapter,
  GetSettingAdapter,
  ListAttemptsAdapter,
  ListBookmarksAdapter,
  ListEnrollmentsAdapter,
  ListLessonProgressAdapter,
  ListPlanProgressAdapter,
  ListReviewItemsAdapter,
  ListSavedCatalogFiltersAdapter,
  ListStudySessionsAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function createProgressReadAttemptPortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  const bindings: Array<readonly [symbol, () => object]> = [
    [applicationDependencyTokens.listAttempts, () => new ListAttemptsAdapter(getProgressStore())],
    [applicationDependencyTokens.getSession, () => new GetSessionAdapter(getProgressStore())],
    [applicationDependencyTokens.getSetting, () => new GetSettingAdapter(getProgressStore())],
    [
      applicationDependencyTokens.listEnrollments,
      () => new ListEnrollmentsAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.listLessonProgress,
      () => new ListLessonProgressAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.listPlanProgress,
      () => new ListPlanProgressAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.listBookmarks, () => new ListBookmarksAdapter(getProgressStore())],
    [
      applicationDependencyTokens.listReviewItems,
      () => new ListReviewItemsAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.listStudySessions,
      () => new ListStudySessionsAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.listSavedCatalogFilters,
      () => new ListSavedCatalogFiltersAdapter(getProgressStore()),
    ],
  ];

  registerPortFactories(container, bindings);
}
