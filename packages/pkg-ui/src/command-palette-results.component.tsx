import { List } from "@mui/material";
import { UICommandPaletteEmptyState } from "./command-palette-empty-state.component";
import { UICommandPaletteItemList } from "./command-palette-item-list.component";
import type { CommandPaletteEntry } from "./command-palette-entry.interface";

export interface UICommandPaletteResultsProps {
  items: CommandPaletteEntry[];
  emptyLabel: string;
  onSelect(item: CommandPaletteEntry): void;
}

export function UICommandPaletteResults(props: UICommandPaletteResultsProps) {
  return (
    <List>
      {props.items.length > 0 ? (
        <UICommandPaletteItemList items={props.items} onSelect={props.onSelect} />
      ) : (
        <UICommandPaletteEmptyState label={props.emptyLabel} />
      )}
    </List>
  );
}
