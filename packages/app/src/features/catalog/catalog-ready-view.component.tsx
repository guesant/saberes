import { UIContentGroup, UIDisclosure } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogQuestionSessionLauncher } from "../exercises/catalog-question-session-launcher.component";
import { CatalogEmptyState } from "./catalog-empty-state.component";
import { CatalogFilterControls } from "./catalog-filter-controls.component";
import { CatalogGrid } from "./catalog-grid.component";
import { CatalogHeader } from "./catalog-header.component";
import { CatalogTabs } from "./catalog-tabs.component";
import { getCatalogQuestionItemsForTab } from "./get-catalog-question-items-for-tab.function";
import type { CatalogViewModel } from "./catalog-view-model.type";
import type { CatalogReadModel } from "@guesant/saberes-application";

export type CatalogReadyViewProps = {
  data: CatalogReadModel | null;
  viewModel: CatalogViewModel;
};

export function CatalogReadyView(props: CatalogReadyViewProps) {
  const { t } = useTranslation();

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

      <UIDisclosure summary={t("catalog.filterDetails")}>
        <CatalogFilterControls viewModel={viewModel} />
      </UIDisclosure>

      <CatalogTabs catalog={catalog} tab={tab} onTabChange={setTab} />

      <CatalogQuestionSessionLauncher
        questions={getCatalogQuestionItemsForTab({ items: catalog.content, tab })}
      />

      {activeItems.length ? <CatalogGrid items={activeItems} /> : <CatalogEmptyState />}
    </UIContentGroup>
  );
}
