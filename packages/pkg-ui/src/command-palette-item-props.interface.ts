import type { CommandPaletteEntry } from "./command-palette-entry.interface";

export interface UICommandPaletteItemProps {
  item: CommandPaletteEntry;
  onSelect(item: CommandPaletteEntry): void;
}
