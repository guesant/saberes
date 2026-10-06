import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionFeedback } from "./action-feedback.component";

describe("feedback de ações", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("remove a confirmação de salvamento após três segundos", () => {
    vi.useFakeTimers();

    render(<ActionFeedback error={null} state="saved" />);

    expect(screen.getByRole("status").textContent)
      .toContain("Salvo neste dispositivo.");

    const advanceTimers = () => {
      vi.advanceTimersByTime(3000);
    };

    act(advanceTimers);

    expect(screen.queryByRole("status"))
      .toBeNull();
  });

  it("mantém erros visíveis até o usuário poder corrigi-los", () => {
    render(<ActionFeedback error={new Error("Falha ao salvar")} state="error" />);

    expect(screen.getByRole("alert"))
      .toBeTruthy();
  });
});
