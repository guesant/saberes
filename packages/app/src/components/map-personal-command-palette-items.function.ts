import type { PersonalCommandPaletteSource } from "./personal-command-palette-source.interface";
import type { CommandPaletteEntry } from "@guesant/saberes-ui";

export function mapPersonalCommandPaletteItems(
  items: PersonalCommandPaletteSource[],
  prefix: string,
): CommandPaletteEntry[] {
  return items
    .filter((item) => {
      return !item.archived;
    })
    .map((item) => {
      return {
        description: item.contentKey,
        id: `${prefix}:${item.id}`,
        label: item.title,
        value: "/meu-espaco",
      };
    });
}
