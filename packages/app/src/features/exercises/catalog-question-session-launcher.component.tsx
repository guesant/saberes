import { UIButton, UIContentGroup, UITextField, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { startQuestionStudySession } from "./start-question-study-session.function";
import type { CatalogCard } from "@guesant/saberes-application";

export type CatalogQuestionSessionLauncherProps = {
  questions: CatalogCard[];
};

export function CatalogQuestionSessionLauncher(props: CatalogQuestionSessionLauncherProps) {
  const { t } = useTranslation();

  const services = useAppServices();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState("5");

  if (!props.questions.length) {
    return null;
  }

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h5">{t("exercise.sessionTitle")}</UITypography>
      <UITextField
        label={t("exercise.sessionQuantity")}
        inputProps={{ min: 1, max: props.questions.length }}
        onChange={(event) => setQuantity(event.target.value)}
        type="number"
        value={quantity}
      />
      <UIButton
        variant="contained"
        onClick={() =>
          startQuestionStudySession({ navigate, questions: props.questions, quantity, services })
        }
      >
        {t("exercise.startSession")}
      </UIButton>
    </UIContentGroup>
  );
}
