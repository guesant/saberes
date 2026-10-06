import { UIContentGroup, UIFocusedContent } from "@guesant/saberes-ui";
import { CatalogActions } from "./catalog-actions.component";
import { CatalogDiscoveryContent } from "./catalog-discovery-content.component";
import { CatalogHeader } from "./catalog-header.component";
import type { CatalogViewModel } from "./catalog-view-model.type";
import type { CatalogReadModel } from "@guesant/saberes-application";

export type CatalogReadyViewProps = {
  data: CatalogReadModel | null;
  viewModel: CatalogViewModel;
};

export function CatalogReadyView(props: CatalogReadyViewProps) {
  const { data, viewModel } = props;

  const catalog = data || {
    courses: [],
    maps: [],
    plans: [],
    content: [],
  };

  return (
    <UIFocusedContent><UIContentGroup variant="section">
      <CatalogHeader />

      <CatalogActions viewModel={viewModel} />

      <CatalogDiscoveryContent catalog={catalog} />
    </UIContentGroup></UIFocusedContent>
  );
}
