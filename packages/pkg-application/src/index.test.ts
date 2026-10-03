import { describe, expect, it, vi } from "vitest";
import { createApplication, type ContentPort, type ApplicationPorts } from "./index.ts";

describe("application services", () => {
    it("orquestra uma query através de uma port", async () => {
        const getCatalog = vi.fn().mockResolvedValue({
            courses: [],
            maps: [],
            plans: [],
            content: [],
        });
        const ports = {
            content: { getCatalog } as unknown as ContentPort,
            progress: {},
            scheduler: {},
            study: {},
            clock: {},
            ids: {},
        } as unknown as ApplicationPorts;

        await createApplication(ports).catalog.get({ search: "matemática" });

        expect(getCatalog).toHaveBeenCalledWith({ search: "matemática" });
    });
});
