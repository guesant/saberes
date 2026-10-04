import type { CommandPaletteEntry } from "@guesant/saberes-ui";

export interface ShellCommandPaletteProps {
  items: CommandPaletteEntry[];

  onClose(): void;

  onQueryChange(query: string): void;

  onSelect(item: CommandPaletteEntry): void;

  open: boolean;

  query: string;
}
