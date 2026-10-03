import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/AppServicesContext";

export function useLessonViewModel(key: string | undefined) {
    const services = useAppServices();
    const query = useQuery({
        queryKey: ["lesson", key],
        enabled: Boolean(key),
        queryFn: () => services.lessons.get(key as string),
    });
    const saveProgress = (completed: boolean) =>
        services.lessons.saveProgress(`lesson:${String(query.data?.lesson.slug || key)}`, {
            lessonId: query.data?.lesson.id as number | string | undefined,
            completed,
        });
    const saveBookmark = () =>
        services.lessons.bookmark(`lesson:${String(query.data?.lesson.slug || key)}`, {
            lessonId: query.data?.lesson.id,
            title: query.data?.lesson.title,
            type: "lesson",
        });
    let state: "loading" | "error" | "ready" = "ready";
    if (query.isPending) state = "loading";
    else if (query.isError) state = "error";
    return {
        state,
        data: query.data || null,
        error: query.error as Error | null,
        reload: query.refetch,
        saveProgress,
        saveBookmark,
    } as const;
}
