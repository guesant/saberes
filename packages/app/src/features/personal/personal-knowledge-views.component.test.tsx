import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { findRenderedUiGrid } from "./find-rendered-ui-grid.function";
import { PersonalKnowledgeBoardView } from "./personal-knowledge-board-view.component";
import { PersonalKnowledgeTreeView } from "./personal-knowledge-tree-view.component";
import type { PersonalKnowledgeSelectionTestState } from "./personal-knowledge-selection-test-state.interface";
import type { PersonalKnowledgeProjection, PersonalRelationEndpoint } from "@guesant/saberes-application";

const projection: PersonalKnowledgeProjection = {
  nodes: [
    { archived: false, id: "note-1", recordType: "note", title: "Nota local" },
    { archived: false, id: "topic-1", recordType: "topic", title: "Tópico local" },
  ],
  relations: [
    {
      archived: false,
      createdAt: "2026-10-05T00:00:00.000Z",
      id: "relation-1",
      kind: "supports",
      source: { id: "note-1", recordType: "note" },
      target: { id: "topic-1", recordType: "topic" },
      updatedAt: "2026-10-05T00:00:00.000Z",
    },
  ],
};

afterEach(() => {
  cleanup();
});

export function createSelection(): PersonalKnowledgeSelectionTestState {
  let selected: PersonalRelationEndpoint | undefined;

  return {
    getSelected: () => { return selected; },
    selection: {
      clear: () => { selected = undefined; },
      isSelected: () => { return false; },
      select: (endpoint) => { selected = endpoint; },
      selected,
    },
  };
}

describe("visões do conhecimento pessoal", () => {
  it("mantém fallback textual e seleção navegável por teclado na árvore", () => {
    const state = createSelection();

    render(<PersonalKnowledgeTreeView projection={projection} selection={state.selection} />);

    expect(screen.getByText(/note-1/u))
      .toBeTruthy();

    expect(screen.getByText(/topic-1/u))
      .toBeTruthy();

    const nodeButton = screen.getByRole("button", { name: "Selecionar Nota local" });

    fireEvent.keyDown(nodeButton, { key: "Enter" });

    expect(state.getSelected())
      .toMatchObject({ id: "note-1", recordType: "note" });

    expect(document.querySelector("canvas"))
      .toBeNull();

    expect(document.querySelector("svg"))
      .toBeNull();
  });

  it("mantém board responsivo e sem rolagem estrutural presa", () => {
    const state = createSelection();

    render(<PersonalKnowledgeBoardView projection={projection} selection={state.selection} />);

    const grid = findRenderedUiGrid();

    expect(grid)
      .toBeTruthy();

    expect(grid && Number.parseFloat(window.getComputedStyle(grid).gap))
      .toBeGreaterThan(0);

    expect(screen.getByRole("heading", { name: "note" }))
      .toBeTruthy();

    expect(screen.getByRole("heading", { name: "reference" }))
      .toBeTruthy();
  });
});
