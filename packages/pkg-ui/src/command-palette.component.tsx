import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { UICommandPaletteResults } from "./command-palette-results.component";
import { UITextField } from "./text-field.component";
import type { UICommandPaletteProps } from "./command-palette-props.interface";
import type { ReactElement } from "react";

export function UICommandPalette(props: UICommandPaletteProps): ReactElement {
  const normalizedQuery = props.query.trim()
    .toLocaleLowerCase();

  const filteredItems = props.items.filter((item) => {
    const searchableText = `${item.label} ${item.description ?? ""}`.toLocaleLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return (
    <Dialog data-ui-layout="stack" fullWidth maxWidth="sm" onClose={props.onClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <UITextField
          autoFocus
          fullWidth
          label={props.inputLabel}
          onChange={(event) => {
            return props.onQueryChange(event.target.value);
          }}
          value={props.query}
        />
        <UICommandPaletteResults
          emptyLabel={props.emptyLabel}
          items={filteredItems}
          onSelect={props.onSelect}
        />
      </DialogContent>
    </Dialog>
  );
}
