import { UIBox, UITab, UITypography, UIResponsiveTabs } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogReadModel } from "@guesant/saberes-application";

type CatalogTabsProps = {
  catalog: CatalogReadModel;
  tab: number;
  onTabChange(value: number): void;
};

export function CatalogTabs(props: CatalogTabsProps) {
  const { t } = useTranslation();

  return (
    <UIResponsiveTabs
      value={props.tab}
      onChange={(_, value) => {
        return props.onTabChange(value);
      }}
    >
      <UITab
        label={(
          <UIBox gap="xs" inset="none" layout="column" sx={{ alignItems: "center" }}>
            <UITypography variant="caption">{t("catalog.courses")}</UITypography>
            <UITypography variant="caption">{props.catalog.courses.length}</UITypography>
          </UIBox>
        )}
      />

      <UITab
        label={(
          <UIBox gap="xs" inset="none" layout="column" sx={{ alignItems: "center" }}>
            <UITypography variant="caption">{t("catalog.maps")}</UITypography>
            <UITypography variant="caption">{props.catalog.maps.length}</UITypography>
          </UIBox>
        )}
      />

      <UITab
        label={(
          <UIBox gap="xs" inset="none" layout="column" sx={{ alignItems: "center" }}>
            <UITypography variant="caption">{t("catalog.plans")}</UITypography>
            <UITypography variant="caption">{props.catalog.plans.length}</UITypography>
          </UIBox>
        )}
      />

      <UITab
        label={(
          <UIBox gap="xs" inset="none" layout="column" sx={{ alignItems: "center" }}>
            <UITypography variant="caption">{t("catalog.contents")}</UITypography>
            <UITypography variant="caption">{props.catalog.content.length}</UITypography>
          </UIBox>
        )}
      />
    </UIResponsiveTabs>
  );
}
