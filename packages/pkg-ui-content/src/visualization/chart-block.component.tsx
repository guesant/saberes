import { UIPaper, UITypography, UIBox } from "@guesant/saberes-ui";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";

type UIChartBlockProps = {
  block: Extract<EditorialBlock, { type: "chart" }>;
};

export function UIChartBlock(props: UIChartBlockProps) {
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
    <UIPaper variant="outlined" sx={{ p: 2, my: 3 }}>
      <UITypography fontWeight={700}>{block.title || t("content.visualization")}</UITypography>

      <UIBox
        ref={containerRef}
        role="img"
        aria-label={block.title || t("content.editorialChart")}
      />
    </UIPaper>
  );
}
