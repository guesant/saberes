import { UIAlert, UIBox, UIPaper, UITypography } from "@guesant/saberes-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVisualizationSupport } from "./get-visualization-support.function";
import { UIVisualizationTextSummary } from "./visualization-text-summary.component";
import type { KnowledgeMapGraphView } from "./knowledge-map-graph-view.interface";
import type { KnowledgeGraph, KnowledgeMapBlock } from "@guesant/saberes-application";

interface UIKnowledgeMapBlockProps {
  block: KnowledgeMapBlock;
  graph?: KnowledgeGraph;
}

export function UIKnowledgeMapBlock(props: UIKnowledgeMapBlockProps) {
  const { block, graph } = props;

  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hasError, setHasError] = useState(false);

  const title = block.title || t("content.knowledgeMap");

  const nodes = graph?.nodes || block.nodes;

  const edges =
    graph?.edges || block.edges.map((edge) => ({ ...edge, id: `${edge.source}->${edge.target}` }));

  const nodeSummary = nodes
    .map((node) => `${node.label} — ${node.status || t("content.mapStatusUnknown")}`)
    .join("\n");

  const edgeSummary = edges.map((edge) => `${edge.source} → ${edge.target}`).join("\n");

  const textSummary = [
    `${t("content.mapNodes")}: ${nodes.length}`,
    nodeSummary || t("content.mapNoNodes"),
    `${t("content.mapRelations")}: ${edges.length}`,
    edgeSummary || t("content.mapNoRelations"),
  ].join("\n");

  useEffect(() => {
    let graphView: KnowledgeMapGraphView | null = null;

    let active = true;

    if (!getVisualizationSupport().canvas2d) {
      setHasError(true);

      return () => {
        active = false;
      };
    }

    import("cytoscape")
      .then((cytoscapeModule) => {
        if (!active || !containerRef.current) {
          return;
        }

        graphView = cytoscapeModule.default({
          container: containerRef.current,
          elements: {
            nodes: nodes.map((node) => ({ data: { id: node.id, label: node.label } })),
            edges: edges.map((edge) => ({
              data: { id: edge.id, source: edge.source, target: edge.target },
            })),
          },
          style: [{ selector: "node", style: { label: "data(label)" } }],
          layout: { name: "breadthfirst", directed: true, padding: 24 },
        });
      })
      .catch(() => {
        if (active) {
          setHasError(true);
        }
      });

    return () => {
      active = false;

      graphView?.destroy();
    };
  }, [block, graph]);

  return (
    <UIPaper variant="outlined" sx={{ p: 2, my: 3 }}>
      <UITypography fontWeight={700}>{title}</UITypography>

      {hasError ? <UIAlert severity="info">{t("content.mapFallback")}</UIAlert> : null}

      <UIBox ref={containerRef} role="img" aria-label={title} />

      <UIVisualizationTextSummary summary={textSummary} title={t("content.textualAlternative")} />
    </UIPaper>
  );
}
