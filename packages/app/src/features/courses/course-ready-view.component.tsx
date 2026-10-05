import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

  return (
    <>
      <CourseReadyHero
        data={data}
        onStart={onStart}
        progress={progress}
        startError={startError}
        startState={startState}
        started={started}
      />

      <UIDisclosure summary={t("course.learnInSequence")}>
        <CourseModules modules={data.modules} items={data.items} />
      </UIDisclosure>
    </>
  );
}
