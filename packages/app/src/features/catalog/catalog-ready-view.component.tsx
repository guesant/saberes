import { Box, ExploreIcon, InputAdornment, TextField } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogEmptyState } from "./catalog-empty-state.component";
import { CatalogGrid } from "./catalog-grid.component";
import { CatalogHeader } from "./catalog-header.component";
import { CatalogTabs } from "./catalog-tabs.component";
import type { CatalogViewModel } from "./catalog-view-model.type";
import type { CatalogReadModel } from "@guesant/saberes-application";

export type CatalogReadyViewProps = {
  data: CatalogReadModel | null;
  viewModel: CatalogViewModel;
};

export function CatalogReadyView(props: CatalogReadyViewProps) {
  const { data, viewModel } = props;

  const { t } = useTranslation();

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
    <Box>
      <CatalogHeader />

      <TextField
        fullWidth
        placeholder={t("catalog.searchPlaceholder")}
        value={viewModel.filters.search || ""}
        onChange={(event) => viewModel.setFilters({ search: event.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ExploreIcon />
            </InputAdornment>
          ),
        }}
      />

      <CatalogTabs catalog={catalog} tab={tab} onTabChange={setTab} />

      {activeItems.length ? <CatalogGrid items={activeItems} /> : <CatalogEmptyState />}
    </Box>
  );
}
