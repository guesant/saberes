import { UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CalendarViewSelector } from "./calendar-view-selector.component";
import type { CalendarViewControlsProps } from "./calendar-view-controls-props.interface";

export function CalendarViewControls(props: CalendarViewControlsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="inline">
      <UITextField
        label={t("calendar.anchorDate")}
        onChange={(event) => {
          return props.onAnchorDateChange(event.target.value);
        }}
        type="date"
        value={props.anchorDate}
      />
      <CalendarViewSelector onViewChange={props.onViewChange} view={props.view} />
    </UIContentGroup>
  );
}
