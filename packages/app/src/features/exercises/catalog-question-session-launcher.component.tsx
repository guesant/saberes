import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createStartQuestionStudySessionAction } from "./create-start-question-study-session-action.function";
import { QuestionSessionOptions } from "./question-session-options.component";
import type { CatalogCard } from "@guesant/saberes-application";

export type CatalogQuestionSessionLauncherProps = {
  questions: CatalogCard[];
};

export function CatalogQuestionSessionLauncher(props: CatalogQuestionSessionLauncherProps) {
  const { t } = useTranslation();

  const services = useAppServices();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState("5");

  const [durationMinutes, setDurationMinutes] = useState("");

  const start = createStartQuestionStudySessionAction({
    durationMinutes,
    navigate,
    questions: props.questions,
    quantity,
    services,
  });

  if (!props.questions.length) {
    return null;
  }

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h5">{t("exercise.sessionTitle")}</UITypography>
      <QuestionSessionOptions
        durationMinutes={durationMinutes}
        maxQuantity={props.questions.length}
        onDurationChange={setDurationMinutes}
        onQuantityChange={setQuantity}
        quantity={quantity}
      />
      <UIButton variant="contained" onClick={start}>
        {t("exercise.startSession")}
      </UIButton>
    </UIContentGroup>
  );
}
