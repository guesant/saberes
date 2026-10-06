import { fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
import { expect, it, vi } from "vitest";
import { renderCardAction } from "./render-card-action.function";

it("makes an action link wrap the card and preserves its link props", () => {
  const action = createElement("a", {
    "aria-label": "Abrir item",
    className: "existing-class",
    href: "/item",
  });

  const card = createElement("article", { "data-testid": "card" });

  const result = renderCardAction(action, card);

  expect(result.type)
    .toBe("a");

  expect(result)
    .toMatchObject({
      props: {
        "aria-label": "Abrir item",
        children: card,
        className: "existing-class ui-card-action",
        href: "/item",
      },
    });
});

it("leaves cards without an action unchanged", () => {
  const card = createElement("article", { "data-testid": "card" });

  expect(renderCardAction(undefined, card))
    .toBe(card);
});

it("turns a callback action into an accessible card button", () => {
  const onClick = vi.fn();

  const action = createElement("button", { "aria-label": "Começar", onClick, type: "button" });

  const card = createElement("article", { "data-testid": "card" });

  const result = renderCardAction(action, card);

  expect(result)
    .toMatchObject({
      props: {
        children: card,
        onClick,
        role: "button",
        tabIndex: 0,
      },
    });
});

it("activates callback cards with Enter and Space", () => {
  const onClick = vi.fn();

  const action = createElement("button", { "aria-label": "Começar", onClick, type: "button" });

  const view = render(renderCardAction(action, createElement("article")));

  const card = view.getByRole("button", { name: "Começar" });

  fireEvent.keyDown(card, { key: "Enter" });

  fireEvent.keyDown(card, { key: " " });

  expect(onClick)
    .toHaveBeenCalledTimes(2);
});

it("removes disabled callback cards from keyboard activation", () => {
  const action = createElement("button", {
    "aria-label": "Salvando",
    disabled: true,
    onClick: () => {},
    type: "button",
  });

  const result = renderCardAction(action, createElement("article"));

  expect(result)
    .toMatchObject({
      props: {
        "aria-disabled": true,
        onClick: undefined,
        tabIndex: -1,
      },
    });
});
