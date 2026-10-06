import { UIBox, UIChoiceButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CalendarViewSelectorProps } from "./calendar-view-selector-props.interface";

export function CalendarViewSelector(props: CalendarViewSelectorProps) {
  const { t } = useTranslation();

  return (
    <UIBox
      gap="sm"
      inset="none"
      layout="grid"
      sx={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", width: "100%" }}
    >
      <UIChoiceButton
        onClick={() => {
          return props.onViewChange("list");
        }}
        sx={{ minWidth: 0, width: "100%" }}
        variant={props.view === "list" ? "contained" : "outlined"}
      >
        {t("calendar.list")}
      </UIChoiceButton>
      <UIChoiceButton
        onClick={() => {
          return props.onViewChange("week");
        }}
        sx={{ minWidth: 0, width: "100%" }}
        variant={props.view === "week" ? "contained" : "outlined"}
      >
        {t("calendar.week")}
      </UIChoiceButton>
      <UIChoiceButton
        onClick={() => {
          return props.onViewChange("month");
        }}
        sx={{ minWidth: 0, width: "100%" }}
        variant={props.view === "month" ? "contained" : "outlined"}
      >
        {t("calendar.month")}
      </UIChoiceButton>
    </UIBox>
  );
}
