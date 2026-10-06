import { UIBox } from "./box.component";
import { UISectionNavigationLink } from "./section-navigation-link.component";
import type { UISectionNavigationProps } from "./section-navigation-props.interface";
import type { ReactElement } from "react";

export function UISectionNavigation(props: UISectionNavigationProps): ReactElement {
  return (
    <UIBox
      aria-label={props.ariaLabel}
      component="nav"
      columns={3}
      gap="md"
      inset="none"
      layout="grid"
    >
      {props.items.map((item) => {return (
        <UISectionNavigationLink
          key={item.id}
          active={props.activeId === item.id}
          item={item}
          onNavigate={props.onNavigate}
        />
      );})}
    </UIBox>
  );
}
