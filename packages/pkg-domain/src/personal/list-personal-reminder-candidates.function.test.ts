import { describe, expect, it } from "vitest";
import { listPersonalReminderCandidates } from "./list-personal-reminder-candidates.function";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [
    {
      createdAt: "2026-10-01T10:00:00.000Z",
      description: "",
      dueDate: "2026-10-03T10:00:00.000Z",
      id: "activity-due",
      status: "planned",
      title: "Retomar atividade",
      updatedAt: "2026-10-01T10:00:00.000Z",
    },
  ],
  captures: [
    {
      archived: false,
      completed: false,
      createdAt: "2026-10-01T09:00:00.000Z",
      description: "",
      dueDate: "2026-10-02T10:00:00.000Z",
      id: "capture-due",
      priority: "medium",
      title: "Revisar anotação",
      updatedAt: "2026-10-01T09:00:00.000Z",
    },
    {
      archived: false,
      completed: false,
      createdAt: "2026-10-01T09:00:00.000Z",
      description: "",
      dueDate: "2026-10-10T10:00:00.000Z",
      id: "capture-future",
      priority: "low",
      title: "Ainda não vencerá",
      updatedAt: "2026-10-01T09:00:00.000Z",
    },
  ],
  checklists: [],
  notes: [],
  references: [],
};

describe("local personal reminder scheduler", () => {
  it("returns due captures and activities ordered by due date", () => {
    expect(listPersonalReminderCandidates({
      now: "2026-10-04T10:00:00.000Z",
      workspace,
    }))
      .toEqual([
        {
          dueAt: "2026-10-02T10:00:00.000Z",
          id: "capture-due",
          source: "capture",
          title: "Revisar anotação",
        },
        {
          dueAt: "2026-10-03T10:00:00.000Z",
          id: "activity-due",
          source: "activity",
          title: "Retomar atividade",
        },
      ]);
  });

  it("ignores completed, archived and future records", () => {
    expect(listPersonalReminderCandidates({
      now: "2026-10-04T10:00:00.000Z",
      workspace: {
        ...workspace,
        activities: workspace.activities.map((activity) => {
          return { ...activity, status: "completed" };
        }),
        captures: workspace.captures.map((capture) => {
          return { ...capture, archived: true };
        }),
      },
    }))
      .toEqual([]);
  });
});
