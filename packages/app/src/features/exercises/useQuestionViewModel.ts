import { useQuery } from "@tanstack/react-query";
import { useAppDependencies } from "../../composition/AppDependenciesContext";
import { useAppServices } from "../../composition/AppServicesContext";

export function useQuestionViewModel(key: string | undefined) {
    const services = useAppServices();
    const dependencies = useAppDependencies();
    const query = useQuery({
        queryKey: ["question", key],
        enabled: Boolean(key),
        queryFn: () => services.getQuestion(key as string),
    });
    const submit = async (answer: string) => {
        if (!query.data) return null;
        const question = query.data.question;
        const expected = String(question.correct_answer || "").toUpperCase();
        const correct =
            Boolean(question.is_automatically_gradable) &&
            answer.toUpperCase() === expected;
        await dependencies.progress.recordAttempt({
            contentKey: String(
                question.occurrence_key || `question:${question.occurrence_id}`,
            ),
            questionId: question.occurrence_id as number,
            answer,
            isCorrect: question.is_automatically_gradable ? correct : null,
            topicIds: query.data.topics.map(
                (topic) => topic.topic_id as number,
            ),
        });
        return question.is_automatically_gradable ? correct : null;
    };
    let state: "loading" | "error" | "ready" = "ready";
    if (query.isPending) state = "loading";
    else if (query.isError) state = "error";
    return {
        state,
        data: query.data || null,
        error: query.error as Error | null,
        reload: query.refetch,
        submit,
    } as const;
}
