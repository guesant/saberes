import { FocusSessionStatus, getContentReferenceKey } from "@guesant/saberes-application";
import { UICard, UICardContent, UIBox, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { FocusSessionContentKey } from "./focus-session-content-key.component";
import type { FocusSession } from "@guesant/saberes-application";

export interface FocusSessionItemProps {
  session: FocusSession;
}

export function FocusSessionItem(props: FocusSessionItemProps) {
  const { t } = useTranslation();
  let statusLabel = t("focus.status.active");

  if (props.session.status === FocusSessionStatus.Completed) {
    statusLabel = t("focus.status.completed");
  }

  if (props.session.status === FocusSessionStatus.Paused) {
    statusLabel = t("focus.status.paused");
  }
  const elapsedMinutes = Math.floor(props.session.elapsedMs / 60000);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const remainingMinutes = elapsedMinutes % 60;
  const duration = elapsedHours > 0
    ? t("focus.duration.hoursAndMinutes", { hours: elapsedHours, minutes: remainingMinutes })
    : t("focus.duration.minutes", { minutes: elapsedMinutes });
  const date = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(props.session.startedAt));

  return (
    <UICard variant="outlined">
      <UICardContent>
        <UIBox gap="xs" inset="none" layout="column">
          <UITypography variant="h6">{statusLabel}</UITypography>
          <UITypography color="text.secondary" variant="body2">{date} · {duration}</UITypography>
        </UIBox>
        {getContentReferenceKey(props.session.contentReference) ? (
          <FocusSessionContentKey contentKey={getContentReferenceKey(props.session.contentReference) || ""} />
        ) : null}
      </UICardContent>
    </UICard>
  );
}
