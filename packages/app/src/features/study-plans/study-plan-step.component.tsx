import {
  CheckCircleIcon,
  EventNoteIcon,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type StudyPlanStepProps = {
  step: Record<string, unknown>;
  completed: boolean;
  onToggle: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
};

export function StudyPlanStep(props: StudyPlanStepProps) {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined">
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <IconButton
          aria-label={props.completed ? t("lesson.completed") : t("lesson.complete")}
          onClick={() => props.onToggle(props.step, !props.completed)}
        >
          {props.completed ? <CheckCircleIcon /> : <EventNoteIcon />}
        </IconButton>

        <Stack>
          <Typography variant="h6">
            {String(props.step.position)}.{String(props.step.title)}
          </Typography>

          <Typography color="text.secondary">{String(props.step.description || "")}</Typography>

          <Chip size="small" label={props.completed ? t("plan.completed") : t("plan.nextStep")} />
        </Stack>
      </Stack>
    </Paper>
  );
}
