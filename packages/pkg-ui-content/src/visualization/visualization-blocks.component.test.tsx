import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UIChartBlock } from "./chart-block.component";
import * as visualizationSupport from "./get-visualization-support.function";
import { UIKnowledgeMapBlock } from "./knowledge-map-block.component";
import { UIParametricSceneBlock } from "./parametric-scene-block.component";
import type { KnowledgeMapBlock } from "@guesant/saberes-application";

const manyNodeMap: KnowledgeMapBlock = {
  type: "knowledge_map",
  nodes: Array.from({ length: 48 }, (_, index) => {
    return {
      id: `topic-${index}`,
      label: `Tópico ${index}`,
      status: "available",
    };
  }),
  edges: Array.from({ length: 47 }, (_, index) => {
    return {
      source: `topic-${index}`,
      target: `topic-${index + 1}`,
    };
  }),
};

afterEach(() => {
  cleanup();

  vi.restoreAllMocks();
});

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

  it("mantém o resumo acessível quando o mapa possui muitos nós", () => {
    render(<UIKnowledgeMapBlock block={manyNodeMap} />);

    expect(screen.getByRole("img", { name: "Mapa de conhecimento" }))
      .toBeTruthy();

    expect(screen.getByText(/Tópicos: 48/u))
      .toBeTruthy();

    expect(screen.getByText(/topic-0 → topic-1/u))
      .toBeTruthy();
  });
});

describe("fallback de capacidade gráfica", () => {
  it("mantém os dados tabulares quando o canvas não está disponível", async () => {
    vi.spyOn(visualizationSupport, "getVisualizationSupport")
      .mockReturnValue({ canvas2d: false, webgl: false });

    render(
      <UIChartBlock
        block={{
          type: "chart",
          option: { series: [{ data: [1, 2, 3], type: "bar" }] },
          title: "Desempenho",
        }}
      />,
    );

    expect(await screen.findByText(/não pôde ser carregado neste dispositivo/u))
      .toBeTruthy();

    expect(screen.getByText(/series/u))
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
