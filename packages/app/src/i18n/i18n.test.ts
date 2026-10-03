import { describe, expect, it } from "vitest";
import { i18n, UI_LOCALE } from ".";

describe("interface localization", () => {
  it("uses the single published UI locale without a remote fallback", () => {
    expect(UI_LOCALE).toBe("pt-BR");

    expect(i18n.language).toBe("pt-BR");

    expect(i18n.options.supportedLngs).toEqual(["pt-BR", "cimode"]);

    expect(i18n.t("nav.catalog")).toBe("Catálogo");
  });
});
