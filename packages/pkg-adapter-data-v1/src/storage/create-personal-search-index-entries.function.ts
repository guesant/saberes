import type { PersonalSearchIndexEntry } from "./personal-search-index-entry.interface";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export function createPersonalSearchIndexEntries(
  workspace: PersonalWorkspace,
): PersonalSearchIndexEntry[] {
  const notes: PersonalSearchIndexEntry[] = workspace.notes.map((note) => {
    return {
      id: `note:${note.id}`,
      recordId: note.id,
      recordType: "note",
      searchText: [note.title, note.body, note.contentKey ?? ""].join(" "),
      updatedAt: note.updatedAt,
    };
  });

  const checklists: PersonalSearchIndexEntry[] = workspace.checklists.map((checklist) => {
    return {
      id: `checklist:${checklist.id}`,
      recordId: checklist.id,
      recordType: "checklist",
      searchText: [checklist.title, ...checklist.items.map((item) => {return item.label;}), checklist.contentKey ?? ""].join(" "),
      updatedAt: checklist.updatedAt,
    };
  });

  const captures: PersonalSearchIndexEntry[] = workspace.captures.map((capture) => {
    return {
      id: `capture:${capture.id}`,
      recordId: capture.id,
      recordType: "capture",
      searchText: [capture.title, capture.description, capture.contentKey ?? ""].join(" "),
      updatedAt: capture.updatedAt,
    };
  });

  const activities: PersonalSearchIndexEntry[] = workspace.activities.map((activity) => {
    return {
      id: `activity:${activity.id}`,
      recordId: activity.id,
      recordType: "activity",
      searchText: [activity.title, activity.description, activity.contentKey ?? ""].join(" "),
      updatedAt: activity.updatedAt,
    };
  });

  const references: PersonalSearchIndexEntry[] = workspace.references.map((reference) => {
    return {
      id: `reference:${reference.id}`,
      recordId: reference.id,
      recordType: "reference",
      searchText: [
        reference.title,
        reference.source,
        reference.location,
        reference.tags.join(" "),
        reference.privateNote,
        reference.contentKey ?? "",
      ].join(" "),
      updatedAt: reference.updatedAt,
    };
  });

  return [...notes, ...checklists, ...captures, ...activities, ...references];
}
