import { describe, expect, it } from "vitest";
import { getButtonActionIconName } from "./get-button-action-icon-name.function";

describe("getButtonActionIconName: common actions", () => {
  it("maps common action labels to recognizable leading icons", () => {
    expect(getButtonActionIconName("Salvar questão"))
      .toBe("bookmark");

    expect(getButtonActionIconName("Criar meta"))
      .toBe("add");

    expect(getButtonActionIconName("Excluir"))
      .toBe("delete");

    expect(getButtonActionIconName("Continuar"))
      .toBe("arrowForward");
  });
});

describe("getButtonActionIconName: contextual actions", () => {
  it("uses distinct icons for personal workspace creation and relation choices", () => {
    expect(getButtonActionIconName("Nova nota"))
      .toBe("note");

    expect(getButtonActionIconName("Nova lista de estudo"))
      .toBe("checklist");

    expect(getButtonActionIconName("Novo lembrete de estudo"))
      .toBe("reminder");

    expect(getButtonActionIconName("Nova referência"))
      .toBe("reference");

    expect(getButtonActionIconName("Âncora"))
      .toBe("anchor");

    expect(getButtonActionIconName("Backlink"))
      .toBe("backlink");

    expect(getButtonActionIconName("Apoia"))
      .toBe("supports");

    expect(getButtonActionIconName("Depende de"))
      .toBe("dependsOn");
  });

  it("gives prior-knowledge choices distinct, meaningful icons", () => {
    expect(getButtonActionIconName("Já conheço"))
      .toBe("known");

    expect(getButtonActionIconName("Tenho dúvida"))
      .toBe("uncertain");

    expect(getButtonActionIconName("Ainda não conheço"))
      .toBe("unknown");
  });

  it("uses meaningful icons for review actions instead of generic arrows", () => {
    expect(getButtonActionIconName("Novamente · 06/10/2026 19:46"))
      .toBe("reviewAgain");

    expect(getButtonActionIconName("Difícil · 06/10/2026 19:51"))
      .toBe("reviewHard");

    expect(getButtonActionIconName("Bom · 06/10/2026 19:55"))
      .toBe("reviewGood");

    expect(getButtonActionIconName("Fácil · 07/10/2026 19:45"))
      .toBe("reviewEasy");

    expect(getButtonActionIconName("Revisar"))
      .toBe("question");

    expect(getButtonActionIconName("Ver fila de revisão"))
      .toBe("queue");

    expect(getButtonActionIconName("Adiar 1 dia"))
      .toBe("snooze");

    expect(getButtonActionIconName("Suspender"))
      .toBe("suspend");
  });

  it("uses a review affordance instead of media playback for starting review", () => {
    expect(getButtonActionIconName("Começar revisão"))
      .toBe("refresh");

    expect(getButtonActionIconName("Ajustar meta de retenção"))
      .toBe("settings");

    expect(getButtonActionIconName("Praticar questões"))
      .toBe("question");

    expect(getButtonActionIconName("Iniciar foco"))
      .toBe("play");
  });

  it("uses a neutral action icon when there is no known action keyword", () => {
    expect(getButtonActionIconName("Meu curso"))
      .toBe("action");
  });
});
