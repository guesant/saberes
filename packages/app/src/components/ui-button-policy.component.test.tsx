import { UIButton, UIChoiceButton, UIFormAction, theme } from "@guesant/saberes-ui";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

it("renders compact text actions as labeled icon-only buttons", () => {
  render(<UIButton variant="text" iconShape="round">Excluir</UIButton>);

  const button = screen.getByRole("button", { name: "Excluir" });

  expect(button.classList.contains("UIButton-iconOnly-round"))
    .toBe(true);

  expect(button.querySelector(".MuiButton-startIcon"))
    .not.toBeNull();

  expect(button)
    .toHaveAttribute("title", "Excluir");
});

it("hides labels by default across button variants and widths", () => {
  render(
    <>
      <UIButton variant="contained">Criar meta</UIButton>
      <UIButton variant="outlined">Abrir catálogo</UIButton>
      <UIButton fullWidth variant="text">Continuar</UIButton>
    </>,
  );

  for (const label of ["Criar meta", "Abrir catálogo", "Continuar"]) {
    const button = screen.getByRole("button", { name: label });

    expect(button.classList.contains("UIButton-iconOnly-square"))
      .toBe(true);

    expect(button.querySelector(".MuiButton-startIcon"))
      .not.toBeNull();
  }
});

it("allows an explicit text-label exception when the action needs it", () => {
  render(<UIButton iconOnly={false} variant="outlined">Começar simulado</UIButton>);

  const button = screen.getByRole("button", { name: "Começar simulado" });

  expect(button.classList.contains("UIButton-iconOnly"))
    .toBe(false);

  expect(button.querySelector(".MuiButton-startIcon"))
    .not.toBeNull();
});

it("keeps visible labels for options selected from a set", () => {
  render(<UIChoiceButton variant="outlined">Difícil</UIChoiceButton>);

  const button = screen.getByRole("button", { name: "Difícil" });

  expect(button.classList.contains("UIButton-iconOnly"))
    .toBe(false);
});

it("keeps the label on form actions, where the primary action must be explicit", () => {
  render(<UIFormAction variant="contained">Verificar resposta</UIFormAction>);

  const button = screen.getByRole("button", { name: "Verificar resposta" });

  expect(button.classList.contains("UIButton-iconOnly"))
    .toBe(false);

  expect(button.querySelector(".MuiButton-startIcon"))
    .not.toBeNull();
});

it("marks pressed actions as toggles with a selected visual state", () => {
  render(<UIButton aria-pressed variant="text">Salvar questão</UIButton>);

  const button = screen.getByRole("button", { name: "Salvar questão" });

  expect(button.classList.contains("UIButton-toggle"))
    .toBe(true);

  expect(button)
    .toHaveAttribute("aria-pressed", "true");
});

it("uses consistent square geometry and selected styles for icon and toggle buttons", () => {
  const buttonRoot = theme.components?.MuiButton?.styleOverrides?.root;

  expect(buttonRoot)
    .toMatchObject({
      "&.UIButton-iconOnly": { minWidth: 44, width: 44 },
      "&.UIButton-toggle[aria-pressed='true']": {
        backgroundColor: "var(--mui-palette-action-selected)",
      },
      "&.UIButton-iconOnly.UIButton-toggle": {
        border: "1px solid var(--mui-palette-divider)",
      },
    });
});
