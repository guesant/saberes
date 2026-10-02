import { describe, expect, it, vi } from "vitest";
import type { ContentPort } from "@guesant/saberes-core";
import { createGetCatalogUseCase } from "./use-cases/getCatalog";

describe("casos de uso", () => {
    it("orquestra o catálogo por uma porta, sem conhecer SQL", async () => {
        const getCatalog = vi.fn().mockResolvedValue({
            courses: [],
            maps: [],
            plans: [],
            content: [],
        });
        const content = { getCatalog } as unknown as ContentPort;
        const execute = createGetCatalogUseCase(content);

        await execute({ search: "matemática" });

        expect(getCatalog).toHaveBeenCalledWith({ search: "matemática" });
    });
});
