import { CatalogCardType, type CatalogCard } from "@guesant/saberes-application";
import { format } from "date-fns";

export type SelectDailyQuestionInput = {
  content: CatalogCard[];
  date: Date;
};

export function selectDailyQuestion(input: SelectDailyQuestionInput): CatalogCard | null {
  const questions = input.content.filter((card) => card.type === CatalogCardType.Question);

  if (!questions.length) {
    return null;
  }

  const dateKey = format(input.date, "yyyy-MM-dd");

  const seed = Array.from(dateKey).reduce(
    (total, character, index) => total + character.charCodeAt(0) * (index + 1),
    0,
  );

  return questions[seed % questions.length] || null;
}
