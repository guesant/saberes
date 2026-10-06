import { StudyGoalMetric } from "@guesant/saberes-application";
import { UIContentGroup, UIForm } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { GoalFormFields } from "./goal-form-fields.component";
import { useGoalForm } from "./use-goal-form.hook";
import type { CreateStudyGoalInput } from "./create-study-goal-input.interface";
import type { FormEvent } from "react";

export interface GoalFormProps {
  formId: string;
  onCreate(input: CreateStudyGoalInput): Promise<void>;
  existingTitles: string[];
}

export function GoalForm(props: GoalFormProps) {
  const { t } = useTranslation();

  const form = useGoalForm({
    existingTitles: props.existingTitles,
    onCreate: props.onCreate,
  });

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    event.stopPropagation();

    form.handleSubmit()
      .catch(() => {
        return undefined;
      });
  };

  return (
    <UIContentGroup variant="content">
      <UIForm id={props.formId} onSubmit={submit}>
        <GoalFormFields
          dueAtLabel={t("goals.dueAtLabel")}
          existingTitles={props.existingTitles}
          form={form}
          metricLabels={{
            [StudyGoalMetric.Lessons]: t("goals.metrics.lessons"),
            [StudyGoalMetric.Minutes]: t("goals.metrics.minutes"),
            [StudyGoalMetric.Questions]: t("goals.metrics.questions"),
            [StudyGoalMetric.Steps]: t("goals.metrics.steps"),
          }}
          targetLabel={t("goals.targetLabel")}
          titleLabel={t("goals.titleLabel")}
        />
      </UIForm>
    </UIContentGroup>
  );
}
