import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { TopicCurriculumCoverage } from "@guesant/saberes-application";

export interface TopicCurriculumSummaryProps {
  curriculum: TopicCurriculumCoverage;
}

export function TopicCurriculumSummary(props: TopicCurriculumSummaryProps) {
  const { t } = useTranslation();

  const { curriculum } = props;

  return (
    <UIContentGroup variant="list">
      <UITypography variant="subtitle2">{t("topics.preparationScope")}</UITypography>
      <UITypography color="text.secondary">
        {t("topics.programStatus", { status: t(`editorial.status.${curriculum.reviewStatus}`) })}
        {" · "}
        {t("topics.classificationStatus", {
          status: t(`editorial.status.${curriculum.canonicalMappingStatus}`),
        })}
      </UITypography>
      <UITypography color="text.secondary">
        {t("topics.practiceCoverage", {
          approved: curriculum.historicalQuestionCount,
          candidates: curriculum.candidateQuestionCount,
          learning: curriculum.learningResourceCount,
          practice: curriculum.practiceResourceCount,
        })}
      </UITypography>
      <UITypography color="text.secondary">
        {t("topics.programEvidence", {
          title: curriculum.sourceTitle || t("topics.noProgramEvidence"),
          page: curriculum.sourcePage?.toString() || "",
        })}
      </UITypography>
      <UITypography color="text.secondary">{curriculum.sourceUrl || ""}</UITypography>
      <UITypography color="text.secondary">
        {t("topics.coveragePending", { count: curriculum.missingRequirements.length })}
      </UITypography>
    </UIContentGroup>
  );
}
