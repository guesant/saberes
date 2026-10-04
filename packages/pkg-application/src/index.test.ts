import { describe, expect, it, vi } from "vitest";
import { createApplication, type ApplicationPorts, type GetCatalogPort } from "./index";

describe("application services", () => {
  it("orquestra uma query através de uma port", async () => {
    const getCatalog = vi.fn()
      .mockResolvedValue({
        courses: [],
        maps: [],
        plans: [],
        content: [],
      });

    const ports = {
      getCatalog: { execute: getCatalog } as GetCatalogPort,
    } as ApplicationPorts;

    await createApplication(ports).catalog.get.execute({ search: "matemática" });

    expect(getCatalog)
      .toHaveBeenCalledWith({ search: "matemática" });
  });
});
