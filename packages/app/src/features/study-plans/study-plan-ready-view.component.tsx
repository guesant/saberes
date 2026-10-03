import { Card, CardContent, Stack, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createCompletedStepSet } from "./create-completed-step-set.function";
import { getStudyPlanDescription } from "./get-study-plan-description.function";
import { StudyPlanSteps } from "./study-plan-steps.component";
import type { StudyPlanReadModel } from "@guesant/saberes-application";

export type StudyPlanReadyViewProps = {
  data: StudyPlanReadModel;
  progress: Array<Record<string, unknown>>;
  onToggle: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
};

export function StudyPlanReadyView(props: StudyPlanReadyViewProps) {
  const { data, progress, onToggle } = props;

  const { t } = useTranslation();

  const completed = createCompletedStepSet(progress);

  return (
    <>
      <Typography variant="overline">{t("plan.eyebrow")}</Typography>

      <Typography variant="h3">{String(data.plan?.title)}</Typography>

      <Typography color="text.secondary">{getStudyPlanDescription(data)}</Typography>

      <Stack spacing={2}>
        <StudyPlanSteps steps={data.steps} completed={completed} onToggle={onToggle} />
      </Stack>

      <Card>
        <CardContent>{t("plan.editorialNotice")}</CardContent>
      </Card>
    </>
  );
}
