import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { CourseModules } from "./course-modules.component";
import { CourseReadyHero } from "./course-ready-hero.component";
import type { CourseProgress } from "./course-progress.interface";
import type { CourseReadModel } from "@guesant/saberes-application";

export type CourseReadyViewProps = {
  data: CourseReadModel;
  started: boolean;
  progress: CourseProgress;
  onStart(): Promise<void>;
};

export function CourseReadyView(props: CourseReadyViewProps) {
  const { data, progress, started, onStart } = props;

  const { t } = useTranslation();

  return (
    <>
      <CourseReadyHero data={data} onStart={onStart} progress={progress} started={started} />

      <UITypography variant="h5">{t("course.learnInSequence")}</UITypography>

      <CourseModules modules={data.modules} items={data.items} />
    </>
  );
}
