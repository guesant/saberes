import { AttemptConfidence } from "@guesant/saberes-application";
import { UIChoiceButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionConfidenceInputProps } from "./question-confidence-input-props.type";

export function QuestionConfidenceInput(props: QuestionConfidenceInputProps) {
  const { onChange, value } = props;

  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="subtitle2">{t("exercise.confidenceLabel")}</UITypography>
      <UIInlineActions equal>
        <UIChoiceButton
          variant={value === AttemptConfidence.Confident ? "contained" : "outlined"}
          onClick={() => {
            return onChange(AttemptConfidence.Confident);
          }}
        >
          {t("exercise.confidence.confident")}
        </UIChoiceButton>
        <UIChoiceButton
          variant={value === AttemptConfidence.Doubt ? "contained" : "outlined"}
          onClick={() => {
            return onChange(AttemptConfidence.Doubt);
          }}
        >
          {t("exercise.confidence.doubt")}
        </UIChoiceButton>
        <UIChoiceButton
          variant={value === AttemptConfidence.Guess ? "contained" : "outlined"}
          onClick={() => {
            return onChange(AttemptConfidence.Guess);
          }}
        >
          {t("exercise.confidence.guess")}
        </UIChoiceButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
