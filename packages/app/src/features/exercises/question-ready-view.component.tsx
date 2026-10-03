import { Button, Card, CardContent, Stack, Typography } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionOption } from "./question-option.component";
import { QuestionResult } from "./question-result.component";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type QuestionReadyViewProps = {
  data: QuestionReadModel;
  onSubmit: (answer: string) => Promise<boolean | null>;
};

export function QuestionReadyView(props: QuestionReadyViewProps) {
  const { data, onSubmit } = props;

  const { t } = useTranslation();

  const [answer, setAnswer] = useState<string | null>(null);

  const [result, setResult] = useState<boolean | null>(null);

  const { question } = data;

  const handleSubmit = async () => {
    if (answer) {
      setResult(await onSubmit(answer));
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="overline">{t("common.selectionProcess")}</Typography>

        <Typography variant="h4">{String(question.number || "")}</Typography>

        <Typography sx={{ whiteSpace: "pre-wrap" }}>{String(question.statement || "")}</Typography>

        <Stack spacing={1.5}>
          {data.options.map((option) => (
            <QuestionOption
              key={String(option.id)}
              option={option}
              selected={answer === option.code}
              onSelect={setAnswer}
            />
          ))}
        </Stack>

        <Button variant="contained" disabled={!answer} onClick={handleSubmit}>
          {t("exercise.respond")}
        </Button>

        {result !== null ? <QuestionResult result={result} /> : null}
      </CardContent>
    </Card>
  );
}
