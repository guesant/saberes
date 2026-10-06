import type { SectionNavigationItem } from "./section-navigation-item.type";

export interface UISectionNavigationLinkProps {
  active: boolean;
  item: SectionNavigationItem;
  onNavigate(id: string): void;
}
