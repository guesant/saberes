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
  const getContentRepository = (): ContentRepositoryContract => {
    return resolvePort<ContentRepositoryContract>(
      container,
      applicationDependencyTokens.contentRepository,
    );
  };

  const bindings: PortFactoryBinding[] = [
    [
      applicationDependencyTokens.getTopicMap,
      () => {
        return new SqlJsGetTopicMapAdapter(getContentRepository());
      },
    ],
    [
      applicationDependencyTokens.getTopic,
      () => {
        return new SqlJsGetTopicAdapter(getContentRepository());
      },
    ],
    [
      applicationDependencyTokens.getStudyPlan,
      () => {
        return new SqlJsGetStudyPlanAdapter(getContentRepository());
      },
    ],
  ];

  registerPortFactories(container, bindings);
}
