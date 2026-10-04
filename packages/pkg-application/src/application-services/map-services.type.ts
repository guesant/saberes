import type { BuildKnowledgeGraphQueryHandler } from "../queries/build-knowledge-graph.query-handler";
import type { GetTopicMapQueryHandler } from "../queries/get-topic-map.query-handler";

export type MapServices = {
  get: GetTopicMapQueryHandler;
  buildGraph: BuildKnowledgeGraphQueryHandler;
};
