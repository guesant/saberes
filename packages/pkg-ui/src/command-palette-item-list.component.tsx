import { UICommandPaletteItem } from "./command-palette-item.component";
import type { CommandPaletteEntry } from "./command-palette-entry.interface";

export interface UICommandPaletteItemListProps {
  items: CommandPaletteEntry[];
  onSelect(item: CommandPaletteEntry): void;
}

export function UICommandPaletteItemList(props: UICommandPaletteItemListProps) {
  return (
    <>
      {props.items.map((item) => {
        return <UICommandPaletteItem item={item} key={item.id} onSelect={props.onSelect} />;
      })}
    </>
  );
}
