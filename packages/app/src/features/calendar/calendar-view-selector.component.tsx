import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CalendarViewSelectorProps } from "./calendar-view-selector-props.interface";

export function CalendarViewSelector(props: CalendarViewSelectorProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <UIButton
        onClick={() => {
          return props.onViewChange("list");
        }}
        variant={props.view === "list" ? "contained" : "outlined"}
      >
        {t("calendar.list")}
      </UIButton>
      <UIButton
        onClick={() => {
          return props.onViewChange("week");
        }}
        variant={props.view === "week" ? "contained" : "outlined"}
      >
        {t("calendar.week")}
      </UIButton>
      <UIButton
        onClick={() => {
          return props.onViewChange("month");
        }}
        variant={props.view === "month" ? "contained" : "outlined"}
      >
        {t("calendar.month")}
      </UIButton>
    </UIInlineActions>
  );
}
