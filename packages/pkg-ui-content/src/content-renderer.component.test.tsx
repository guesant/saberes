import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UIContentRenderer } from "./content-renderer.component";

describe("renderizador de conteúdo editorial", () => {
  it("renderiza Markdown, fórmula e bloco permitido", () => {
    render(
      <UIContentRenderer
        markdown={"## Conceito\n\nTexto **importante**."}
        blocks={[
          {
            type: "callout",
            title: "Atenção",
            content: "Revise antes de praticar.",
          },
          { type: "formula", formula: "f(x)=ax+b" },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Conceito" }))
      .toBeTruthy();

    expect(screen.getByText("Atenção"))
      .toBeTruthy();

    expect(screen.getByText("Revise antes de praticar."))
      .toBeTruthy();

    expect(screen.queryByText("Conteúdo editorial revisado"))
      .toBeNull();
  });

  it("não interpreta HTML arbitrário como conteúdo executável", () => {
    render(
      <UIContentRenderer markdown={"<script>alert(&quot;x&quot;)</script>\n\nTexto seguro"} />,
    );

    expect(screen.getByText("Texto seguro"))
      .toBeTruthy();

    expect(document.querySelector("script"))
      .toBeNull();
  });
});
