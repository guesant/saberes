import type { SectionNavigationItem } from "./section-navigation-item.type";

export interface UISectionNavigationProps {
  activeId: string;
  ariaLabel: string;
  items: SectionNavigationItem[];
  onNavigate(id: string): void;
}
