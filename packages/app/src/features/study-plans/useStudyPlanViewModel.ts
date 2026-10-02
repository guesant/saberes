import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDependencies } from "../../composition/AppDependenciesContext";
import { useAppServices } from "../../composition/AppServicesContext";

export function useStudyPlanViewModel(slug?: string) {
    const services = useAppServices();
    const dependencies = useAppDependencies();
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["study-plan", slug || "default"],
        queryFn: () => services.getStudyPlan(slug),
    });
    const progressQuery = useQuery({
        queryKey: ["plan-progress"],
        queryFn: () => dependencies.progress.listPlanProgress(),
    });
    const toggleStep = async (step: Record<string, unknown>, completed: boolean) => {
        const planId = query.data?.plan?.id;
        if (!planId) return;
        await dependencies.progress.savePlanProgress({
            contentKey: `plan:${String(query.data?.plan?.slug || planId)}:step:${String(step.id)}`,
            planId: planId as number,
            stepId: step.id as number,
            completed,
        });
        await queryClient.invalidateQueries({ queryKey: ["plan-progress"] });
    };
    let state: "loading" | "error" | "ready" = "ready";
    if (query.isPending || progressQuery.isPending) state = "loading";
    else if (query.isError || progressQuery.isError) state = "error";
    return {
        state,
        data: query.data || null,
        progress: progressQuery.data || [],
        error: query.error || progressQuery.error || null,
        reload: async () => {
            await Promise.all([query.refetch(), progressQuery.refetch()]);
        },
        toggleStep,
    } as const;
}
