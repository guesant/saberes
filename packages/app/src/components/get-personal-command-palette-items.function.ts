import { mapPersonalCommandPaletteItems } from "./map-personal-command-palette-items.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";
import type { CommandPaletteEntry } from "@guesant/saberes-ui";

export function getPersonalCommandPaletteItems(
  workspace: PersonalWorkspace | undefined,
): CommandPaletteEntry[] {
  const collections = workspace
    ? [workspace.notes, workspace.references, workspace.captures, workspace.checklists]
    : [];

  const prefixes = ["note", "reference", "capture", "checklist"];

  return collections.flatMap((items, index) => {
    return mapPersonalCommandPaletteItems(items, prefixes[index]);
  });
}
