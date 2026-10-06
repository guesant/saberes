import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UIButton } from "./button.component";
import { UIDialog } from "./dialog.component";

describe("UIDialog", () => {
  it("shows explicit close and cancel actions with a separated confirmation footer", () => {
    render(
      <UIDialog
        actions={<UIButton>Confirmar</UIButton>}
        onClose={vi.fn()}
        open
        title="Adicionar compromisso"
      >
        <p>Conteúdo do formulário</p>
      </UIDialog>,
    );

    expect(screen.getByRole("button", { name: "Fechar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeVisible();
  });

  it("provides a confirmation action in the footer when no custom action is supplied", () => {
    render(
      <UIDialog onClose={vi.fn()} open title="Filtrar catálogo">
        <p>Filtros</p>
      </UIDialog>,
    );

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeVisible();
  });

  it("does not close when the backdrop is clicked", () => {
    render(
      <UIDialog onClose={vi.fn()} open title="Modal de teste">
        <p>Conteúdo</p>
      </UIDialog>,
    );

    fireEvent.click(document.querySelector(".MuiBackdrop-root")!);

    expect(screen.getByRole("dialog", { name: "Modal de teste" })).toBeVisible();
  });
});
