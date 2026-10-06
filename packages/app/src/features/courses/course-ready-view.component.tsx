import { UIContentGroup } from "@guesant/saberes-ui";
import { CourseModules } from "./course-modules.component";
import { CourseReadyHero } from "./course-ready-hero.component";
import type { CourseProgress } from "./course-progress.interface";
import type { ActionState } from "../../types/action-state.type";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseReadyViewProps = {
  data: CourseReadModel;
  started: boolean;
  progress: CourseProgress;
  onStart(): Promise<void>;
  startError: Error | null;
  startState: ActionState;
};

export function CourseReadyView(props: CourseReadyViewProps) {
  const { data, progress, started, onStart, startError, startState } = props;

  return (
    <UIContentGroup variant="section">
      <CourseReadyHero
        data={data}
        onStart={onStart}
        progress={progress}
        startError={startError}
        startState={startState}
        started={started}
      />

      <CourseModules modules={data.modules} items={data.items} />
    </UIContentGroup>
  );
}
