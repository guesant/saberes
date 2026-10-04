import { StudyPlanStep } from "./study-plan-step.component";

export type StudyPlanStepsProps = {
  steps: Array<Record<string, unknown>>;
  completed: Set<string>;
  skipped: Set<string>;
  onToggle(step: Record<string, unknown>, completed: boolean): Promise<void>;

  onSkip(stepId: string): Promise<void>;

  onMove(stepId: string, direction: -1 | 1): Promise<void>;
};

export function StudyPlanSteps(props: StudyPlanStepsProps) {
  return (
    <>
      {props.steps.map((step) => (
        <StudyPlanStep
          key={String(step.id)}
          step={step}
          completed={props.completed.has(String(step.id))}
          skipped={props.skipped.has(String(step.id))}
          onToggle={props.onToggle}
          onSkip={props.onSkip}
          onMove={props.onMove}
        />
      ))}
    </>
  );
}
