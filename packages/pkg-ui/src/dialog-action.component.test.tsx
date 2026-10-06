import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UIDialogAction } from "./dialog-action.component";

describe("UIDialogAction", () => {
  it("shows secondary content only on request and closes with Escape", async () => {
    render(
      <UIDialogAction label="Ver detalhes" title="Detalhes">
        <p>Conteúdo adicional</p>
      </UIDialogAction>,
    );

    expect(screen.queryByText("Conteúdo adicional"))
      .not.toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: "Ver detalhes" });

    trigger.focus();

    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Detalhes" });

    expect(screen.getByText("Conteúdo adicional"))
      .toBeVisible();

    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitForElementToBeRemoved(dialog);

    expect(trigger)
      .toHaveFocus();
  });
});
