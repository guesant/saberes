import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveContentPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "getCatalog"
  | "getCourse"
  | "getLesson"
  | "getQuestion"
  | "getAssessment"
  | "getTopicMap"
  | "getTopic"
  | "getStudyPlan"
  | "parseEditorialBlocks"
  | "buildKnowledgeGraph"
> {
  return {
    getCatalog: resolvePort(container, applicationDependencyTokens.getCatalog),
    getCourse: resolvePort(container, applicationDependencyTokens.getCourse),
    getLesson: resolvePort(container, applicationDependencyTokens.getLesson),
    getQuestion: resolvePort(container, applicationDependencyTokens.getQuestion),
    getAssessment: resolvePort(container, applicationDependencyTokens.getAssessment),
    getTopicMap: resolvePort(container, applicationDependencyTokens.getTopicMap),
    getTopic: resolvePort(container, applicationDependencyTokens.getTopic),
    getStudyPlan: resolvePort(container, applicationDependencyTokens.getStudyPlan),
    parseEditorialBlocks: resolvePort(container, applicationDependencyTokens.parseEditorialBlocks),
    buildKnowledgeGraph: resolvePort(container, applicationDependencyTokens.buildKnowledgeGraph),
  };
}
