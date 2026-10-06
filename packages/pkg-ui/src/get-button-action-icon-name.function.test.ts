import { describe, expect, it } from "vitest";
import { getButtonActionIconName } from "./get-button-action-icon-name.function";

describe("getButtonActionIconName", () => {
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

  it("uses a navigation affordance when there is no known action keyword", () => {
    expect(getButtonActionIconName("Meu curso"))
      .toBe("arrowForward");
  });
});
