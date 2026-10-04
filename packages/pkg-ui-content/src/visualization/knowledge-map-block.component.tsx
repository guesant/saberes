import { UIAlert, UIBox, UIPaper, UITypography } from "@guesant/saberes-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { EditorialBlock, KnowledgeGraph } from "@guesant/saberes-application";

type UIKnowledgeMapBlockProps = {
  block: Extract<EditorialBlock, { type: "knowledge_map" }>;
  graph?: KnowledgeGraph;
};

export function UIKnowledgeMapBlock(props: UIKnowledgeMapBlockProps) {
  const { block, graph } = props;

  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let graphView: { destroy: () => void } | null = null;

    let active = true;

    import("cytoscape")
      .then((cytoscapeModule) => {
        if (!active || !containerRef.current) {
          return;
        }

        const nodes = graph?.nodes || block.nodes;

        const edges =
          graph?.edges ||
          block.edges.map((edge) => ({ ...edge, id: `${edge.source}->${edge.target}` }));

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

  if (hasError) {
    return <UIAlert severity="info">{t("content.mapFallback")}</UIAlert>;
  }

  return (
    <UIPaper variant="outlined" sx={{ p: 2, my: 3 }}>
      <UITypography fontWeight={700}>{block.title || t("content.knowledgeMap")}</UITypography>

      <UIBox ref={containerRef} role="img" aria-label={block.title || t("content.knowledgeMap")} />
    </UIPaper>
  );
}
