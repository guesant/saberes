import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UIChartBlock } from "./chart-block.component";
import { UIKnowledgeMapBlock } from "./knowledge-map-block.component";
import { UIParametricSceneBlock } from "./parametric-scene-block.component";

describe("alternativa textual do gráfico", () => {
  it("mantém o resumo textual do gráfico junto da visualização", () => {
    render(
      <UIChartBlock
        block={{
          type: "chart",
          option: { series: [{ data: [1, 2, 3], type: "bar" }] },
          title: "Desempenho",
        }}
      />,
    );

    expect(screen.getByText("Alternativa textual"))
      .toBeTruthy();

    expect(screen.getByText(/series/u))
      .toBeTruthy();
  });
});

describe("alternativa textual do mapa", () => {
  it("mantém tópicos e relações do mapa em texto", () => {
    render(
      <UIKnowledgeMapBlock
        block={{
          type: "knowledge_map",
          nodes: [{ id: "topic-a", label: "Tópico A", status: "available" }],
          edges: [{ source: "topic-a", target: "topic-b" }],
          title: "Mapa",
        }}
      />,
    );

    expect(screen.getByText(/Tópicos: 1/u))
      .toBeTruthy();

    expect(screen.getByText(/topic-a → topic-b/u))
      .toBeTruthy();
  });
});

describe("alternativa textual da cena parametrizada", () => {
  it("mantém os parâmetros da cena 3D em texto", () => {
    render(
      <UIParametricSceneBlock
        block={{
          type: "parametric_scene",
          shape: "cube",
          color: "#152a4a",
          scale: 2,
          rotationSpeed: 0.5,
          title: "Sólido",
        }}
      />,
    );

    expect(screen.getByText(/Forma: cubo/u))
      .toBeTruthy();

    expect(screen.getByText(/Escala: 2/u))
      .toBeTruthy();
  });
});
