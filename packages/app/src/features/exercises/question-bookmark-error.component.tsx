import { UIAlert, UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionBookmarkErrorProps } from "./question-bookmark-error-props.type";

export function QuestionBookmarkError(props: QuestionBookmarkErrorProps) {
  const { t } = useTranslation();

  return (
    <UIAlert severity="warning">
      <UIContentGroup variant="tight">
        {t("exercise.bookmarkError", { message: props.error.message })}
        <UIButton
          onClick={() => {
            return props.onRetry();
          }}
          size="small"
        >
          {t("common.retry")}
        </UIButton>
      </UIContentGroup>
    </UIAlert>
  );
}
