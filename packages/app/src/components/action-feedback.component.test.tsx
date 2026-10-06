import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionFeedback } from "./action-feedback.component";
import { ActionToastProvider } from "./action-toast-provider.component";

describe("feedback de ações", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("remove a confirmação de salvamento após três segundos e meio", () => {
    vi.useFakeTimers();

    render(
      <ActionToastProvider>
        <ActionFeedback error={null} state="saved" />
      </ActionToastProvider>,
    );

    expect(screen.getByRole("status").textContent)
      .toContain("Salvo neste dispositivo.");

    const advanceTimers = () => {
      vi.advanceTimersByTime(3500);
    };

    act(advanceTimers);

    expect(screen.queryByRole("status"))
      .toBeNull();
  });

  it("mantém erros visíveis até o usuário poder corrigi-los", () => {
    render(
      <ActionToastProvider>
        <ActionFeedback error={new Error("Falha ao salvar")} state="error" />
      </ActionToastProvider>,
    );

    expect(screen.getByRole("alert"))
      .toBeTruthy();
  });

});

describe("estado de salvamento", () => {
  it("não insere estado de salvamento ao lado do botão", () => {
    const rendered = render(
      <ActionToastProvider>
        <ActionFeedback error={null} state="saving" />
      </ActionToastProvider>,
    );

    expect(rendered.container.textContent)
      .toBe("");
  });
});

describe("fila de notificações", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("enfileira confirmações para exibi-las sem sobrepor toasts", () => {
    vi.useFakeTimers();

    render(
      <ActionToastProvider>
        <ActionFeedback error={null} state="saved" />
        <ActionFeedback error={null} state="cancelled" />
      </ActionToastProvider>,
    );

    expect(screen.getByRole("status").textContent)
      .toContain("Salvo neste dispositivo.");

    const dismissToast = () => {
      vi.advanceTimersByTime(3500);
    };

    act(dismissToast);

    expect(screen.getByRole("status").textContent)
      .toContain("Operação cancelada.");
  });
});
