// @ts-nocheck -- fixtures do renderer serão tipadas junto da migração do componente.
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentRenderer } from "./ContentRenderer";

describe("renderizador de conteúdo editorial", () => {
    it("renderiza Markdown, fórmula e bloco permitido", () => {
        render(
            <ContentRenderer
                markdown={"## Conceito\n\nTexto **importante**."}
                blocksJson={JSON.stringify([
                    {
                        type: "callout",
                        title: "Atenção",
                        content: "Revise antes de praticar.",
                    },
                    { type: "formula", formula: "f(x)=ax+b" },
                ])}
            />,
        );
        expect(screen.getByRole("heading", { name: "Conceito" })).toBeInTheDocument();
        expect(screen.getByText("Atenção")).toBeInTheDocument();
        expect(screen.getByText("Revise antes de praticar.")).toBeInTheDocument();
        expect(screen.getByText("Conteúdo editorial revisado")).toBeInTheDocument();
    });

    it("não interpreta HTML arbitrário como conteúdo executável", () => {
        render(<ContentRenderer markdown={'<script>alert("x")</script>\n\nTexto seguro'} />);
        expect(screen.getByText("Texto seguro")).toBeInTheDocument();
        expect(document.querySelector("script")).toBeNull();
    });
});
