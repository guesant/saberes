import { describe, expect, it } from "vitest";
import { parseEditorialBlocks, validatePedagogicalRoles } from "./schema";

describe("contrato editorial", () => {
    it("aceita apenas blocos estruturados conhecidos", () => {
        const blocks = parseEditorialBlocks(
            JSON.stringify([
                { type: "callout", content: "Atenção" },
                { type: "parametric_scene", shape: "sphere", scale: 1.2 },
                { type: "script", code: "alert(1)" },
            ]),
        );
        expect(blocks).toHaveLength(2);
        expect(blocks[1]).toMatchObject({
            type: "parametric_scene",
            shape: "sphere",
        });
    });

    it("identifica a progressão pedagógica incompleta", () => {
        const result = validatePedagogicalRoles([
            "context",
            "analogy",
            "formalization",
        ]);
        expect(result.valid).toBe(false);
        expect(result.missing).toContain("review");
    });
});
