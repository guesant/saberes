import type { CommandPaletteEntry } from "./command-palette-entry.interface";

export interface UICommandPaletteProps {
  emptyLabel: string;
  inputLabel: string;
  items: CommandPaletteEntry[];
  onClose(): void;

  onQueryChange(query: string): void;

  onSelect(item: CommandPaletteEntry): void;
  open: boolean;
  query: string;
  title: string;
}
