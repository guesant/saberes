import { describe, expect, it } from "vitest";
import { createCalendarEntry } from "./create-calendar-entry.function";
import { listCalendarEntries } from "./list-calendar-entries.function";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  calendarEntries: [],
  captures: [],
  checklists: [],
  notes: [],
  references: [],
};

describe("calendar entries", () => {
  it("creates one entry from the selected position and is idempotent", () => {
    const input = {
      description: "Revisar o conteúdo.",
      id: "entry-1",
      now: "2026-10-05T10:00:00.000Z",
      startsAt: "2026-10-08T14:00:00.000Z",
      title: "Revisão",
      workspace,
    };

    const created = createCalendarEntry(input);

    const repeated = createCalendarEntry({ ...input, workspace: created });

    const conflicting = createCalendarEntry({
      ...input,
      description: "Descrição conflitante.",
      title: "Outro título",
      workspace: created,
    });

    expect(created.calendarEntries)
      .toHaveLength(1);

    expect(created.calendarEntries?.[0].startsAt)
      .toBe(input.startsAt);

    expect(created.calendarEntries?.[0])
      .not
      .toHaveProperty("recurrence");

    expect(created.calendarEntries?.[0])
      .not
      .toHaveProperty("exception");

    expect(repeated.calendarEntries)
      .toHaveLength(1);

    expect(conflicting.calendarEntries?.[0].title)
      .toBe(input.title);
  });

  it("keeps long text and many entries stable in a month", () => {
    const longText = "Texto de compromisso local ".repeat(40);

    const workspaceWithManyEntries = Array.from({ length: 30 }, (_, index) => {
      return index;
    })
      .reduce((currentWorkspace, index) => {
        const day = String(index + 1)
          .padStart(2, "0");

        return createCalendarEntry({
          description: longText,
          id: `entry-${day}`,
          now: "2026-10-01T08:00:00.000Z",
          startsAt: `2026-10-${day}T10:00:00.000Z`,
          title: `Compromisso ${day}`,
          workspace: currentWorkspace,
        });
      }, workspace);

    const entries = listCalendarEntries({
      anchorDate: "2026-10-15T10:00:00.000Z",
      view: "month",
      workspace: workspaceWithManyEntries,
    });

    expect(entries)
      .toHaveLength(30);

    expect(entries[0].description)
      .toBe(longText);

    expect(entries[29].id)
      .toBe("entry-30");
  });

  it("lists entries in the selected month and week", () => {
    const withEntries = createCalendarEntry({
      description: "Semana atual",
      id: "entry-week",
      now: "2026-10-05T10:00:00.000Z",
      startsAt: "2026-10-07T14:00:00.000Z",
      title: "Semana",
      workspace,
    });

    const monthEntry = createCalendarEntry({
      description: "Mês seguinte",
      id: "entry-month",
      now: "2026-10-05T10:00:00.000Z",
      startsAt: "2026-11-03T14:00:00.000Z",
      title: "Mês",
      workspace: withEntries,
    });

    expect(listCalendarEntries({
      anchorDate: "2026-10-05T10:00:00.000Z",
      view: "list",
      workspace: withEntries,
    }))
      .toHaveLength(0);

    expect(listCalendarEntries({
      anchorDate: "2026-10-07T10:00:00.000Z",
      view: "list",
      workspace: monthEntry,
    }))
      .toHaveLength(1);

    expect(listCalendarEntries({
      anchorDate: "2026-10-05T10:00:00.000Z",
      view: "week",
      workspace: monthEntry,
    }))
      .toHaveLength(1);

    expect(listCalendarEntries({
      anchorDate: "2026-11-05T10:00:00.000Z",
      view: "month",
      workspace: monthEntry,
    }))
      .toHaveLength(1);
  });
});
