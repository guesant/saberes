import { UIAlert, UIBox, UIContentSurface, UIContentText } from "@guesant/saberes-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVisualizationSupport } from "./get-visualization-support.function";
import { UIVisualizationTextSummary } from "./visualization-text-summary.component";
import type { ChartBlock } from "@guesant/saberes-application";
import type { ECharts } from "echarts";

interface UIChartBlockProps {
  block: ChartBlock;
}

export function UIChartBlock(props: UIChartBlockProps) {
  const { block } = props;

  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hasError, setHasError] = useState(false);

  const title = block.title || t("content.visualization");

  const textSummary = JSON.stringify(block.option, null, 2) || t("content.noVisualizationData");

  useEffect(() => {
    let chart: ECharts | null = null;

    let active = true;

    setHasError(false);

    if (!getVisualizationSupport().canvas2d) {
      setHasError(true);

      return () => {
        active = false;
      };
    }

    import("echarts")
      .then(({ init }) => {
        if (!active || !containerRef.current) {
          return;
        }

        chart = init(containerRef.current, undefined, { renderer: "canvas" });

        chart.setOption(block.option);
      })
      .catch(() => {
        if (active) {
          setHasError(true);
        }
      });

    return () => {
      active = false;

      chart?.dispose();
    };
  }, [block.option]);

  return (
    <UIContentSurface mode="outlined">
      <UIContentText variant="title">{title}</UIContentText>

      {hasError ? <UIAlert severity="info">{t("content.chartFallback")}</UIAlert> : null}

      <UIBox ref={containerRef} role="img" aria-label={title || t("content.editorialChart")} />

      <UIVisualizationTextSummary summary={textSummary} title={t("content.textualAlternative")} />
    </UIContentSurface>
  );
}
