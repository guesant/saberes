import { describe, expect, it } from "vitest";
import { updateStudyChecklistContent } from "./update-study-checklist-content.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

const workspace: PersonalWorkspace = {
  captures: [],
  checklists: [
    {
      archived: false,
      contentKey: "lesson:one",
      createdAt: "2026-10-04T00:00:00.000Z",
      id: "checklist-1",
      items: [
        { completed: true, id: "item-1", label: "Ler", position: 0 },
        { completed: false, id: "item-2", label: "Praticar", position: 1 },
      ],
      title: "Antigo",
      updatedAt: "2026-10-04T00:00:00.000Z",
    },
  ],
  notes: [],
  references: [],
};

describe("updateStudyChecklistContent", () => {
  it("preserva IDs e conclusão ao editar título e itens", () => {
    const result = updateStudyChecklistContent({
      id: "checklist-1",
      itemIds: ["new-item-1", "new-item-2", "new-item-3"],
      items: ["Ler novamente", "Praticar", "Revisar"],
      now: "2026-10-04T12:00:00.000Z",
      title: "Novo checklist",
      workspace,
    });

    expect(result.checklists[0]).toMatchObject({
      title: "Novo checklist",
      updatedAt: "2026-10-04T12:00:00.000Z",
    });

    expect(result.checklists[0].items).toEqual([
      { completed: true, id: "item-1", label: "Ler novamente", position: 0 },
      { completed: false, id: "item-2", label: "Praticar", position: 1 },
      { completed: false, id: "new-item-3", label: "Revisar", position: 2 },
    ]);
  });
});
