import { cloneElement, createElement } from "react";
import { UIBox } from "./box.component";
import { handleCardActionKeydown } from "./handle-card-action-keydown.function";
import type { CardActionElement } from "./card-action-element.type";
import type { MouseEventHandler, ReactElement } from "react";

export function renderCardAction(action: CardActionElement | undefined, card: ReactElement): ReactElement {
  if (!action) {
    return card;
  }

  const className = [action.props.className, "ui-card-action"]
    .filter(Boolean)
    .join(" ");

  if (action.props.onClick) {
    const { onClick: actionHandler } = action.props;

    let onClick: MouseEventHandler<HTMLElement> | undefined = actionHandler;

    let tabIndex = 0;

    if (action.props.disabled) {
      onClick = undefined;

      tabIndex = -1;
    }

    return createElement(
      UIBox,
      {
        "aria-disabled": action.props.disabled,
        "aria-label": action.props["aria-label"],
        className: `${className} ui-card-action--button`,
        component: "div",
        gap: "none",
        inset: "none",
        layout: "native",
        onClick,
        onKeyDown: handleCardActionKeydown,
        role: "button",
        tabIndex,
      },
      card,
    );
  }

  return cloneElement(action, { children: card, className });
}
