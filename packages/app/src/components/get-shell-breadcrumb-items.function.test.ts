import { describe, expect, it } from "vitest";
import { getShellBreadcrumbItems } from "./get-shell-breadcrumb-items.function";

export const translate = (key: string): string => {return key;};

describe("getShellBreadcrumbItems", () => {
  it("shows the current page for a top-level route", () => {
    expect(getShellBreadcrumbItems("/agenda", translate))
      .toEqual([
        { label: "nav.home", to: "/" },
        { label: "nav.calendar" },
      ]);
  });

  it("links nested pages through their parent sections", () => {
    expect(getShellBreadcrumbItems("/topicos/fisica.mecanica", translate))
      .toEqual([
        { label: "nav.home", to: "/" },
        { label: "nav.catalog", to: "/catalogo" },
        { label: "nav.topics" },
      ]);

    expect(getShellBreadcrumbItems("/desempenho/detalhes", translate))
      .toEqual([
        { label: "nav.home", to: "/" },
        { label: "nav.performance", to: "/desempenho" },
        { label: "nav.details" },
      ]);
  });

  it("marks the home page as the only current breadcrumb", () => {
    expect(getShellBreadcrumbItems("/", translate))
      .toEqual([{ label: "nav.home" }]);
  });
});
