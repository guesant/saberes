import { UIContentSurface, UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LessonEditorialMetadataPanel } from "./lesson-editorial-metadata-panel.component";
import { LessonSectionNavigation } from "./lesson-section-navigation.component";
import type { LessonReadySecondaryContentProps } from "./lesson-ready-secondary-content-props.interface";

export function LessonReadySecondaryContent(props: LessonReadySecondaryContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <UIDisclosure summary={t("lesson.details")}>
        <LessonEditorialMetadataPanel data={props.data} />
      </UIDisclosure>
      <UIDisclosure summary={t("lesson.navigateSections")}>
        <UIContentSurface mode="outlined">
          <LessonSectionNavigation
            sections={props.data.sections}
            selectedIndex={props.sectionIndex}
            onSectionSelect={props.onSectionChange}
          />
        </UIContentSurface>
      </UIDisclosure>
    </>
  );
}
