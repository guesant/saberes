import {
  SqlJsGetStudyPlanAdapter,
  SqlJsGetTopicAdapter,
  SqlJsGetTopicMapAdapter,
  type ContentRepositoryContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function registerContentGraphPortBindings(container: Container): void {
  const getContentRepository = (): ContentRepositoryContract =>
    resolvePort<ContentRepositoryContract>(
      container,
      applicationDependencyTokens.contentRepository,
    );

  const bindings: PortFactoryBinding[] = [
    [
      applicationDependencyTokens.getTopicMap,
      () => new SqlJsGetTopicMapAdapter(getContentRepository()),
    ],
    [applicationDependencyTokens.getTopic, () => new SqlJsGetTopicAdapter(getContentRepository())],
    [
      applicationDependencyTokens.getStudyPlan,
      () => new SqlJsGetStudyPlanAdapter(getContentRepository()),
    ],
  ];

  registerPortFactories(container, bindings);
}
