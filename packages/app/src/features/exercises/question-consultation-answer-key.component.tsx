import { UITypography } from "@guesant/saberes-ui";

export type QuestionConsultationAnswerKeyProps = {
  answer?: string;
};

export function QuestionConsultationAnswerKey(props: QuestionConsultationAnswerKeyProps) {
  if (!props.answer?.trim()) {
    return null;
  }

  return (
    <UITypography color="text.secondary">
      Gabarito cadastrado: {props.answer}
    </UITypography>
  );
}
