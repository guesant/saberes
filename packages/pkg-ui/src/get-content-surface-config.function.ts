import type { ContentSurfaceConfig } from "./content-surface-config.type";
import type { UIContentSurfaceProps } from "./content-surface-props.interface";

const surfaceConfigs: Record<UIContentSurfaceProps["mode"], ContentSurfaceConfig> = {
  outlined: {
    marginY: 3,
    padding: 2,
    variant: "outlined",
  },
  scrolling: {
    marginY: 3,
    overflowX: "auto",
    padding: 2,
    variant: "outlined",
  },
  summary: {
    backgroundColor: "primary.main",
    marginY: 3,
    padding: 2.5,
    variant: "elevation",
  },
  "text-summary": {
    marginTop: 2,
    marginY: 0,
    padding: 2,
    variant: "outlined",
  },
};

export function getContentSurfaceConfig(mode: UIContentSurfaceProps["mode"]): ContentSurfaceConfig {
  return surfaceConfigs[mode];
}
