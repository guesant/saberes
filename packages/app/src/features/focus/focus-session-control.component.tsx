import {
  UICard,
  UICardContent,
  UIBox,
  UIContentGroup,
  UITypography,
} from "@guesant/saberes-ui";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContentReferenceField } from "../../components/content-reference-field.component";
import { FocusPauseAction } from "./focus-pause-action.component";
import { FocusResumeAction } from "./focus-resume-action.component";
import { FocusStartAction } from "./focus-start-action.component";
import { FocusStopAction } from "./focus-stop-action.component";
import type { FocusSessionActions } from "./focus-session-actions.interface";
import type { FocusSession } from "@guesant/saberes-application";

export interface FocusSessionControlProps extends Omit<FocusSessionActions, "active" | "paused"> {
  activeSession: FocusSession | null;
  pausedSession: FocusSession | null;
  onStart(contentKey?: string): Promise<void>;
}

export function FocusSessionControl(props: FocusSessionControlProps) {
  const { t } = useTranslation();

  const [contentKey, setContentKey] = useState("");
  const [now, setNow] = useState(Date.now());
  const active = props.activeSession !== null;
  const paused = props.pausedSession !== null;

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const interval = window.setInterval(() => { return setNow(Date.now()); }, 1000);

    return () => { return window.clearInterval(interval); };
  }, [active]);

  let elapsedMs = props.pausedSession?.elapsedMs ?? 0;

  if (props.activeSession) {
    elapsedMs = Math.max(0, now - Date.parse(props.activeSession.startedAt));
  }
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const timerText = [
    Math.floor(elapsedSeconds / 3600),
    Math.floor((elapsedSeconds % 3600) / 60),
    elapsedSeconds % 60,
  ].map((value) => { return String(value).padStart(2, "0"); }).join(":");

  const start = async (): Promise<void> => {
    await props.onStart(contentKey.trim() || undefined);
  };

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">
            {active ? t("focus.active") : paused ? t("focus.paused") : t("focus.ready")}
          </UITypography>
          {(active || paused) && (
            <UIBox
              aria-label={t("focus.elapsedTime")}
              gap="xs"
              inset="md"
              layout="column"
              role="timer"
              sx={{
                alignItems: "center",
                backgroundColor: "var(--mui-palette-background-default)",
                border: "1px solid var(--mui-palette-divider)",
                borderRadius: "0.25rem",
              }}
            >
              <UITypography color="text.secondary" variant="caption">{t("focus.elapsedTime")}</UITypography>
              <UITypography aria-live="off" variant="h3">{timerText}</UITypography>
            </UIBox>
          )}
          <ContentReferenceField
            disabled={active || paused}
            label={t("focus.contentKey")}
            onChange={setContentKey}
            value={contentKey}
          />
          <FocusPauseAction active={active} onPause={props.onPause} />
          <FocusStopAction active={active} onStop={props.onStop} paused={paused} />
          <FocusResumeAction
            active={active}
            onResume={props.onResume}
            paused={paused}
          />
          <FocusStartAction active={active} onStart={start} paused={paused} />
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
