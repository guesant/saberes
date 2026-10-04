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

    expect(screen.getByRole("heading", { name: "Conceito" })).toBeInTheDocument();

    expect(screen.getByText("Atenção")).toBeInTheDocument();

    expect(screen.getByText("Revise antes de praticar.")).toBeInTheDocument();

    expect(screen.getByText("Conteúdo editorial revisado")).toBeInTheDocument();
  });

  it("não interpreta HTML arbitrário como conteúdo executável", () => {
    render(
      <UIContentRenderer markdown={"<script>alert(&quot;x&quot;)</script>\n\nTexto seguro"} />,
    );

    expect(screen.getByText("Texto seguro")).toBeInTheDocument();

    expect(document.querySelector("script")).toBeNull();
  });
});
