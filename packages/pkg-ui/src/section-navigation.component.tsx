import { UIButtonActionIcon } from "./button-action-icon.component";
import { UIResponsiveTabs } from "./responsive-tabs.component";
import { UITab } from "./tab.component";
import type { UISectionNavigationProps } from "./section-navigation-props.interface";
import type { ReactElement } from "react";

export function UISectionNavigation(props: UISectionNavigationProps): ReactElement {
  return (
    <UIResponsiveTabs
      aria-label={props.ariaLabel}
      onChange={(_event, id: string) => {
        props.onNavigate(id);
      }}
      value={props.activeId}
    >
      {props.items.map((item) => {
        return (
          <UITab
            key={item.id}
            aria-label={item.label}
            aria-controls={`painel-${item.id}`}
            id={`aba-${item.id}`}
            icon={item.iconName ? <UIButtonActionIcon name={item.iconName} /> : undefined}
            iconPosition="start"
            label={item.label}
            value={item.id}
          />
        );
      })}
    </UIResponsiveTabs>
  );
}
