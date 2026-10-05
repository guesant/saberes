import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { MyStudyCourseLink } from "./my-study-course-link.component";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudyNextContentProps = {
  course: CatalogCard | null;
};

export function MyStudyNextContent(props: MyStudyNextContentProps) {
  const { t } = useTranslation();

  const { course } = props;

  if (!course) {
    return null;
  }

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("home.startWithTopic")}</UITypography>
          <UITypography color="text.secondary">{course.description || t("catalog.description")}</UITypography>
          <MyStudyCourseLink course={course} />
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
