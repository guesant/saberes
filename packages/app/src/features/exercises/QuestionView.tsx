import { Button, Card, CardContent, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/ContentState";
import { useQuestionViewModel } from "./useQuestionViewModel";

export function QuestionView() {
    const { t } = useTranslation();
    const { questionId } = useParams();
    const viewModel = useQuestionViewModel(`question:${questionId}`);
    const [answer, setAnswer] = useState<string | null>(null);
    const [result, setResult] = useState<boolean | null>(null);
    if (viewModel.state === "loading")
        return <Typography>{t("common.loadingQuestion")}</Typography>;
    if (viewModel.state === "error") {
        return (
            <ContentErrorState
                error={viewModel.error}
                label={t("errors.contentLoad")}
                onRetry={viewModel.reload}
            />
        );
    }
    if (!viewModel.data)
        return <Typography color="text.secondary">{t("exercise.notFound")}</Typography>;
    const question = viewModel.data.question;
    const submit = async () => {
        if (!answer) return;
        setResult(await viewModel.submit(answer));
    };
    return (
        <>
            <Typography variant="overline" color="secondary.main">
                Questão · {String(question.process_name || t("common.selectionProcess"))}
            </Typography>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {String(question.number || "")}
            </Typography>
            <Card>
                <CardContent>
                    <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                        {String(question.statement || "")}
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 3 }}>
                        {viewModel.data.options.map((option) => (
                            <Paper
                                key={String(option.id)}
                                variant="outlined"
                                onClick={() => setAnswer(String(option.code))}
                                sx={{
                                    p: 2,
                                    cursor: "pointer",
                                    borderColor:
                                        answer === option.code ? "primary.main" : undefined,
                                }}
                            >
                                <Typography>
                                    <strong>{String(option.code)})</strong> {String(option.text)}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                    <Button variant="contained" disabled={!answer} onClick={submit} sx={{ mt: 3 }}>
                        {t("exercise.respond")}
                    </Button>
                    {result !== null && (
                        <Typography color={result ? "success.main" : "error.main"} sx={{ mt: 2 }}>
                            {result ? `${t("exercise.correct")}.` : `${t("exercise.incorrect")}.`}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
