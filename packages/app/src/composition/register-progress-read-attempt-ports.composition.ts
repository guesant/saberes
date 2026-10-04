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
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function createProgressReadAttemptPortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract => { return resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore); };

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.listAttempts, () => { return new ListAttemptsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.getSession, () => { return new GetSessionAdapter(getProgressStore()); }],
    [applicationDependencyTokens.getSetting, () => { return new GetSettingAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listEnrollments, () => { return new ListEnrollmentsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listLessonProgress, () => { return new ListLessonProgressAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listPlanProgress, () => { return new ListPlanProgressAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listBookmarks, () => { return new ListBookmarksAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listReviewItems, () => { return new ListReviewItemsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listStudySessions, () => { return new ListStudySessionsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listSavedCatalogFilters, () => { return new ListSavedCatalogFiltersAdapter(getProgressStore()); }],
  ];

  registerPortFactories(container, bindings);
}
