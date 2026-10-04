import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PerformancePeriodFilters } from "./performance-period-filters.component";
import { PerformanceScopeFilters } from "./performance-scope-filters.component";
import type { PerformanceFiltersProps } from "./performance-filters-props.type";

export function PerformanceFilters(props: PerformanceFiltersProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h5">{t("performance.filtersTitle")}</UITypography>
      <PerformancePeriodFilters
        label={(period) => {
          return t(`performance.periods.${period}`);
        }}
        onSelect={props.onChangePeriod}
        selected={props.filter.period}
      />
      <PerformanceScopeFilters
        courseLabel={props.courseLabel}
        label={() => {
          return t("performance.scopes.all");
        }}
        onSelect={props.onChangeScope}
        planLabel={props.planLabel}
        selected={props.filter.scope}
      />
    </UIContentGroup>
  );
}
