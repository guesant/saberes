import { Paper, Typography, Box } from "@guesant/saberes-ui";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-domain";

type ChartBlockProps = {
  block: Extract<EditorialBlock, { type: "chart" }>;
};

export function ChartBlock(props: ChartBlockProps) {
  const { block } = props;

  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let chart: {
      resize: () => void;
      dispose: () => void;
      setOption: (option: unknown) => void;
    } | null = null;

    let active = true;

    import("echarts").then(({ init }) => {
      if (!active || !containerRef.current) {
        return;
      }

      chart = init(containerRef.current, undefined, { renderer: "canvas" });

      chart.setOption(block.option);
    });

    return () => {
      active = false;

      chart?.dispose();
    };
  }, [block.option]);

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
      <Typography fontWeight={700}>{block.title || t("content.visualization")}</Typography>

      <Box ref={containerRef} role="img" aria-label={block.title || t("content.editorialChart")} />
    </Paper>
  );
}
