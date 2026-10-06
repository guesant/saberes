import { getContentReferenceKey } from "@guesant/saberes-application";
import { UICard, UICardContent, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { FocusSessionContentKey } from "./focus-session-content-key.component";
import type { FocusSession } from "@guesant/saberes-application";

export interface FocusSessionItemProps {
  session: FocusSession;
}

export function FocusSessionItem(props: FocusSessionItemProps) {
  const { t } = useTranslation();

  return (
    <UICard variant="outlined">
      <UICardContent>
        <UITypography>
          {t("focus.session", {
            status: props.session.status,
            elapsed: Math.round(props.session.elapsedMs / 60000),
          })}
        </UITypography>
        {getContentReferenceKey(props.session.contentReference) ? (
          <FocusSessionContentKey contentKey={getContentReferenceKey(props.session.contentReference) || ""} />
        ) : null}
      </UICardContent>
    </UICard>
  );
}
