import type { ReactElement } from "react";

export interface TopicSectionPanelProps {
  active: boolean;
  content: ReactElement;
  id: string;
  labelledBy: string;
}
