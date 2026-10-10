import { UIAlert } from "@guesant/saberes-ui";

export interface QuestionConsultationNoticeProps {
  eligible: boolean | undefined;
}

export function QuestionConsultationNotice(props: QuestionConsultationNoticeProps) {
  if (props.eligible !== false) {
    return null;
  }

  return <UIAlert severity="warning">Somente consulta: ocorrência em revisão, fora dos treinos e métricas.</UIAlert>;
}
