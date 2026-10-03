import { Grid } from "@guesant/saberes-ui";
import { CatalogCardView } from "./catalog-card-view.component";
import type { CatalogCard } from "@guesant/saberes-application";

type CatalogGridItemProps = {
  item: CatalogCard;
};

export function CatalogGridItem(props: CatalogGridItemProps) {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <CatalogCardView item={props.item} />
    </Grid>
  );
}
