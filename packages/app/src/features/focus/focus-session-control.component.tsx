import {
  UICard,
  UICardContent,
  UIContentGroup,
  UITypography,
} from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentReferenceField } from "../../components/content-reference-field.component";
import { FocusPauseAction } from "./focus-pause-action.component";
import { FocusResumeAction } from "./focus-resume-action.component";
import { FocusStartAction } from "./focus-start-action.component";
import { FocusStopAction } from "./focus-stop-action.component";
import type { FocusSessionActions } from "./focus-session-actions.interface";

export interface FocusSessionControlProps extends FocusSessionActions {
  active: boolean;
  paused: boolean;
  onStart(contentKey?: string): Promise<void>;
}

export function FocusSessionControl(props: FocusSessionControlProps) {
  const { t } = useTranslation();

  const [contentKey, setContentKey] = useState("");

  const start = async (): Promise<void> => {
    await props.onStart(contentKey.trim() || undefined);
  };

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">
            {props.active ? t("focus.active") : t("focus.ready")}
          </UITypography>
          <ContentReferenceField
            disabled={props.active || props.paused}
            label={t("focus.contentKey")}
            onChange={setContentKey}
            value={contentKey}
          />
          <FocusPauseAction active={props.active} onPause={props.onPause} />
          <FocusStopAction active={props.active} onStop={props.onStop} paused={props.paused} />
          <FocusResumeAction
            active={props.active}
            onResume={props.onResume}
            paused={props.paused}
          />
          <FocusStartAction active={props.active} onStart={start} paused={props.paused} />
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
