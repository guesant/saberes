import type { ContentSurfaceConfig } from "./content-surface-config.type";
import type { UIContentSurfaceProps } from "./content-surface-props.interface";

const surfaceConfigs: Record<UIContentSurfaceProps["mode"], ContentSurfaceConfig> = {
  outlined: {
    padding: 2,
    variant: "outlined",
  },
  scrolling: {
    overflowX: "auto",
    padding: 2,
    variant: "outlined",
  },
  summary: {
    backgroundColor: "action.hover",
    padding: 2.5,
    variant: "outlined",
  },
  "text-summary": {
    padding: 2,
    variant: "outlined",
  },
};

export function getContentSurfaceConfig(mode: UIContentSurfaceProps["mode"]): ContentSurfaceConfig {
  return surfaceConfigs[mode];
}
