import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CalendarEntriesContent } from "./calendar-entries-content.component";
import { CalendarEntryForm } from "./calendar-entry-form.component";
import { CalendarViewControls } from "./calendar-view-controls.component";
import type { CalendarReadyViewProps } from "./calendar-ready-view-props.interface";

export function CalendarReadyView(props: CalendarReadyViewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("calendar.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("calendar.title")}</UITypography>
        <UITypography color="text.secondary">{t("calendar.description")}</UITypography>
      </UIContentGroup>
      <CalendarViewControls
        anchorDate={props.viewModel.anchorDate}
        onAnchorDateChange={props.viewModel.setAnchorDate}
        onViewChange={props.viewModel.setView}
        view={props.viewModel.view}
      />
      <CalendarEntryForm onCreate={props.viewModel.createEntry} />
      <CalendarEntriesContent entries={props.viewModel.entries} />
    </UIContentGroup>
  );
}
