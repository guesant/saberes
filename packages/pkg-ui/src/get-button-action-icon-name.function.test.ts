import { describe, expect, it } from "vitest";
import { getButtonActionIconName } from "./get-button-action-icon-name.function";

describe("getButtonActionIconName", () => {
    it("maps common action labels to recognizable leading icons", () => {
        expect(getButtonActionIconName("Salvar questão")).toBe("bookmark");

        expect(getButtonActionIconName("Criar meta")).toBe("add");

        expect(getButtonActionIconName("Excluir")).toBe("delete");

        expect(getButtonActionIconName("Continuar")).toBe("arrowForward");
    });

    it("uses distinct icons for personal workspace creation and relation choices", () => {
        expect(getButtonActionIconName("Nova nota")).toBe("note");
        expect(getButtonActionIconName("Nova lista de estudo")).toBe(
            "checklist",
        );
        expect(getButtonActionIconName("Novo lembrete de estudo")).toBe(
            "reminder",
        );
        expect(getButtonActionIconName("Nova referência")).toBe("reference");
        expect(getButtonActionIconName("Âncora")).toBe("anchor");
        expect(getButtonActionIconName("Backlink")).toBe("backlink");
        expect(getButtonActionIconName("Apoia")).toBe("supports");
        expect(getButtonActionIconName("Depende de")).toBe("dependsOn");
    });

    it("gives prior-knowledge choices distinct, meaningful icons", () => {
        expect(getButtonActionIconName("Já conheço")).toBe("known");
        expect(getButtonActionIconName("Tenho dúvida")).toBe("uncertain");
        expect(getButtonActionIconName("Ainda não conheço")).toBe("unknown");
    });

    it("uses a navigation affordance when there is no known action keyword", () => {
        expect(getButtonActionIconName("Meu curso")).toBe("arrowForward");
    });
});
