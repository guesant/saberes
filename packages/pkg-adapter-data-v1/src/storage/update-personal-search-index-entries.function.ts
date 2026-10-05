import { createPersonalSearchIndexEntries } from "./create-personal-search-index-entries.function";
import type { PersonalSearchIndexEntry } from "./personal-search-index-entry.interface";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export function updatePersonalSearchIndexEntries(
  previousEntries: PersonalSearchIndexEntry[],
  workspace: PersonalWorkspace,
): PersonalSearchIndexEntry[] {
  const previousById = new Map(previousEntries.map((entry) => {return [entry.id, entry];}));

  return createPersonalSearchIndexEntries(workspace)
    .map((entry) => {
      const previousEntry = previousById.get(entry.id);

      if (
        previousEntry &&
      previousEntry.searchText === entry.searchText &&
      previousEntry.updatedAt === entry.updatedAt
      ) {
        return previousEntry;
      }

      return entry;
    });
}
