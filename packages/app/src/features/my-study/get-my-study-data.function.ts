import { getMyStudyDailyQuestion } from "./get-my-study-daily-question.function";
import { getMyStudySavedLessons } from "./get-my-study-saved-lessons.function";
import { getMyStudySavedQuestions } from "./get-my-study-saved-questions.function";
import { getMyStudyTopicMastery } from "./get-my-study-topic-mastery.function";
import type { MyStudyReadModel } from "./my-study-read-model.interface";
import type {
  Attempt,
  CatalogReadModel,
  ReviewTarget,
  StudyRecord,
} from "@guesant/saberes-application";

const emptyCatalog: CatalogReadModel = {
  content: [],
  courses: [],
  maps: [],
  plans: [],
};

export type GetMyStudyDataInput = {
  attempts: Attempt[] | undefined;
  catalog: CatalogReadModel | undefined;
  reviews: ReviewTarget[] | undefined;
  streak: StudyRecord | undefined;
  achievements: StudyRecord[] | undefined;
  topicMastery: StudyRecord[] | undefined;
  bookmarks: StudyRecord[] | undefined;
  date: Date;
};

export function getMyStudyData(input: GetMyStudyDataInput): MyStudyReadModel {
  const {
    attempts = [],
    catalog = emptyCatalog,
    reviews = [],
    streak,
    achievements = [],
    topicMastery,
    bookmarks,
    date,
  } = input;

  return {
    attempts,
    catalog,
    reviews,
    streak,
    achievements,
    dailyQuestion: getMyStudyDailyQuestion(catalog, date),
    topicMastery: getMyStudyTopicMastery(topicMastery),
    savedLessons: getMyStudySavedLessons({
      content: catalog.content,
      bookmarks,
    }),
    savedQuestions: getMyStudySavedQuestions({
      bookmarks,
      content: catalog.content,
    }),
  };
}
