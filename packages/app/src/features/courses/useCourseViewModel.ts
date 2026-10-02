import { useQuery } from "@tanstack/react-query";
import { useAppDependencies } from "../../composition/AppDependenciesContext";
import { useAppServices } from "../../composition/AppServicesContext";

export function useCourseViewModel(slug: string | undefined) {
    const services = useAppServices();
    const dependencies = useAppDependencies();
    const query = useQuery({
        queryKey: ["course", slug],
        enabled: Boolean(slug),
        queryFn: () => services.getCourse(slug as string),
    });
    const startCourse = async () => {
        if (!query.data?.course) return;
        await dependencies.progress.enrollCourse(
            `course:${String(query.data.course.slug)}`,
            {
                courseId: query.data.course.id,
                slug: query.data.course.slug,
                title: query.data.course.title,
            },
        );
    };
    let state: "loading" | "error" | "ready" = "ready";
    if (query.isPending) state = "loading";
    else if (query.isError) state = "error";
    return {
        state,
        data: query.data || null,
        error: query.error as Error | null,
        reload: query.refetch,
        startCourse,
    } as const;
}
