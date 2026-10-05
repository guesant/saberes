import { UIContentGroup, UIResponsiveFields, UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CatalogCourseTypeFilter } from "./catalog-course-type-filter.component";
import type { CatalogFilterBarProps } from "./catalog-filter-bar-props.type";

export function CatalogFilterBar(props: CatalogFilterBarProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UIResponsiveFields>
        <UITextField
          label={t("catalog.filters.process")}
          onChange={(event) => { return props.onChange({ ...props.filters, processName: event.target.value }); }}
          placeholder={t("catalog.processPlaceholder")}
          value={props.filters.processName || ""}
        />
        <UITextField
          label={t("catalog.filters.year")}
          onChange={(event) => {
            return props.onChange({
              ...props.filters,
              year: event.target.value ? Number(event.target.value) : undefined,
            });
          }}
          placeholder={t("catalog.yearPlaceholder")}
          type="number"
          value={props.filters.year || ""}
        />
      </UIResponsiveFields>
      <CatalogCourseTypeFilter
        onChange={(courseType) => { return props.onChange({ ...props.filters, courseType }); }}
        value={props.filters.courseType}
      />
    </UIContentGroup>
  );
}
