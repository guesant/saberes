import { UIContentGroup, UIDialogAction, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { FocusSessionControl } from "./focus-session-control.component";
import { FocusSessionList } from "./focus-session-list.component";
import type { FocusViewModel } from "./focus.view-model";

export interface FocusReadyViewProps {
  viewModel: FocusViewModel;
}

export function FocusReadyView(props: FocusReadyViewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("focus.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("focus.title")}</UITypography>
        <UITypography color="text.secondary">{t("focus.description")}</UITypography>
      </UIContentGroup>
      <FocusSessionControl
        activeSession={props.viewModel.active}
        onPause={props.viewModel.pause}
        onResume={props.viewModel.resume}
        onStart={props.viewModel.start}
        onStop={props.viewModel.stop}
        pausedSession={props.viewModel.paused}
      />
      <UIDialogAction label={t("focus.history")} title={t("focus.history")}>
        <FocusSessionList sessions={props.viewModel.sessions} />
      </UIDialogAction>
    </UIContentGroup>
  );
}
