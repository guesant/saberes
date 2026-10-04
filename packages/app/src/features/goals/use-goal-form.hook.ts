import { StudyGoalMetric } from "@guesant/saberes-application";
import { useForm } from "@tanstack/react-form";
import type { GoalFormOptions } from "./goal-form-options.interface";
import type { GoalFormValues } from "./goal-form-values.interface";

const initialGoalFormValues: GoalFormValues = {
  details: { dueAt: "", target: "30", title: "" },
  metric: StudyGoalMetric.Minutes,
  milestones: [],
};

export function useGoalForm(options: GoalFormOptions) {
  const form = useForm({
    defaultValues: initialGoalFormValues,
    onSubmit: async ({ value }): Promise<void> => {
      await options.onCreate({
        dueAt: value.details.dueAt,
        metric: value.metric,
        target: Number(value.details.target) || 0,
        title: value.details.title.trim(),
      });

      form.reset();
    },
  });

  return form;
}
