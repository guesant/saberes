import { UICatalogCardGridItem } from "@guesant/saberes-ui";
import { CatalogCardView } from "./catalog-card-view.component";
import type { CatalogCard } from "@guesant/saberes-application";

type CatalogGridItemProps = {
  item: CatalogCard;
};

export function CatalogGridItem(props: CatalogGridItemProps) {
  return (
    <UICatalogCardGridItem>
      <CatalogCardView item={props.item} />
    </UICatalogCardGridItem>
  );
}
