import { UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { CatalogQuestionSessionLauncher } from "../exercises/catalog-question-session-launcher.component";
import { CatalogEmptyState } from "./catalog-empty-state.component";
import { CatalogFilterBar } from "./catalog-filter-bar.component";
import { CatalogGrid } from "./catalog-grid.component";
import { CatalogHeader } from "./catalog-header.component";
import { CatalogSearchField } from "./catalog-search-field.component";
import { CatalogTabs } from "./catalog-tabs.component";
import { getCatalogQuestionItemsForTab } from "./get-catalog-question-items-for-tab.function";
import type { CatalogViewModel } from "./catalog-view-model.type";
import type { CatalogReadModel } from "@guesant/saberes-application";

export type CatalogReadyViewProps = {
  data: CatalogReadModel | null;
  viewModel: CatalogViewModel;
};

export function CatalogReadyView(props: CatalogReadyViewProps) {
  const { data, viewModel } = props;

  const [tab, setTab] = useState(0);

  const catalog = data || {
    courses: [],
    maps: [],
    plans: [],
    content: [],
  };

  const sections = [catalog.courses, catalog.maps, catalog.plans, catalog.content];

  const activeItems = sections[tab] || [];

  return (
    <UIContentGroup variant="section">
      <CatalogHeader />

      <CatalogSearchField
        onChange={(search) => viewModel.setFilters((filters) => ({ ...filters, search }))}
        value={viewModel.filters.search || ""}
      />

      <CatalogFilterBar
        filters={viewModel.filters}
        onChange={(filters) => viewModel.setFilters(filters)}
      />

      <CatalogTabs catalog={catalog} tab={tab} onTabChange={setTab} />

      <CatalogQuestionSessionLauncher
        questions={getCatalogQuestionItemsForTab({ items: catalog.content, tab })}
      />

      {activeItems.length ? <CatalogGrid items={activeItems} /> : <CatalogEmptyState />}
    </UIContentGroup>
  );
}
