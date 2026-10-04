import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import type { StudySession } from "@guesant/saberes-application";

export type MyStudySessionItemProps = {
  session: StudySession;
};

export function MyStudySessionItem(props: MyStudySessionItemProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="body2">
        {t(`home.sessionType.${props.session.activityType || "lesson"}`)}
      </UITypography>
      <UITypography color="text.secondary" variant="caption">
        {props.session.startedAt
          ? format(new Date(props.session.startedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })
          : t("common.now")}{" "}
        {" · "}
        {Math.max(1, Math.round(Number(props.session.durationMs || 0) / 60000))} {t("common.min")}
      </UITypography>
    </UIContentGroup>
  );
}
