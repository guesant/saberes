import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { executeKnowledgeGraph } from "./execute-knowledge-graph.function";
import { findKnowledgeMapBlock } from "./find-knowledge-map-block.function";
import { getEditorialBlocks } from "./get-editorial-blocks.function";
import type { LessonSectionContentInput } from "./lesson-section-content-input.type";
import type { LessonSectionContentQueries } from "./lesson-section-content-queries.interface";

export function useLessonSectionContentQueries(
  props: LessonSectionContentInput,
): LessonSectionContentQueries {
  const services = useAppServices();

  const { section } = props;

  const blocksJson = String(section.blocks_json || "[]");

  const blocksQuery = useQuery({
    queryKey: ["editorial-blocks", section.id, blocksJson],
    queryFn: () => services.editorial.parseBlocks.execute({ blocksJson }),
  });

  const blocks = getEditorialBlocks(blocksQuery.data);

  const mapBlock = findKnowledgeMapBlock(blocks);

  const graphQuery = useQuery({
    queryKey: ["knowledge-graph", section.id, mapBlock],
    enabled: Boolean(mapBlock),
    queryFn: () => executeKnowledgeGraph(services.maps.buildGraph, mapBlock),
  });

  return { blocks: blocksQuery, graph: graphQuery };
}
