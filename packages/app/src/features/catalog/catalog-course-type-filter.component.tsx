import { LearningCourseType } from "@guesant/saberes-application";
import { UIChoiceButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogCourseTypeFilterProps } from "./catalog-course-type-filter-props.type";

export function CatalogCourseTypeFilter(props: CatalogCourseTypeFilterProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIChoiceButton
        onClick={() => {
          return props.onChange(undefined);
        }}
        size="small"
        variant={!props.value ? "contained" : "outlined"}
      >
        {t("catalog.courseType.all")}
      </UIChoiceButton>
      <UIChoiceButton
        onClick={() => {
          return props.onChange(LearningCourseType.General);
        }}
        size="small"
        variant={props.value === LearningCourseType.General ? "contained" : "outlined"}
      >
        {t("catalog.courseType.general")}
      </UIChoiceButton>
      <UIChoiceButton
        onClick={() => {
          return props.onChange(LearningCourseType.Specific);
        }}
        size="small"
        variant={props.value === LearningCourseType.Specific ? "contained" : "outlined"}
      >
        {t("catalog.courseType.specific")}
      </UIChoiceButton>
    </UIInlineActions>
  );
}
