import { Grid } from "@guesant/saberes-ui";
import { CatalogGridItem } from "./catalog-grid-item.component";
import type { CatalogCard } from "@guesant/saberes-application";

export type CatalogGridProps = {
  items: CatalogCard[];
};

export function CatalogGrid(props: CatalogGridProps) {
  return (
    <Grid container spacing={2}>
      {props.items.map((item) => (
        <CatalogGridItem item={item} key={`${item.type}-${item.id}`} />
      ))}
    </Grid>
  );
}
