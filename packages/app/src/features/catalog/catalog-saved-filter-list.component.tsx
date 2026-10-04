import { UIContentGroup } from "@guesant/saberes-ui";
import { CatalogSavedFilterItem } from "./catalog-saved-filter-item.component";
import type { CatalogSavedFilterListProps } from "./catalog-saved-filter-list-props.type";

export function CatalogSavedFilterList(props: CatalogSavedFilterListProps) {
  return (
    <UIContentGroup variant="list">
      {props.filters.map((filter) => {
        return (
          <CatalogSavedFilterItem
            filter={filter}
            key={filter.id}
            onDelete={props.onDelete}
            onSelect={props.onSelect}
          />
        );
      })}
    </UIContentGroup>
  );
}
