export interface CommandPaletteState {
  close(): void;

  open: boolean;
  openPalette(): void;

  query: string;
  setQuery(query: string): void;
}
