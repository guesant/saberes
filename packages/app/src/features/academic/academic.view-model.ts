import { AcademicDiscipline, type AcademicMetrics } from "@guesant/saberes-application";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createAcademicDisciplineFromForm } from "./create-academic-discipline-from-form.function";
import { useAcademicDisciplinesQuery } from "./use-academic-disciplines-query.hook";
import { useSaveAcademicDisciplineMutation } from "./use-save-academic-discipline-mutation.hook";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";

export interface AcademicViewModel {
  state: "loading" | "error" | "ready";
  disciplines: AcademicDiscipline[];
  metrics: AcademicMetrics[];
  error: Error | null;
  save(input: SaveAcademicDisciplineInput): Promise<void>;

  saveError: Error | null;
  remove(id: string): Promise<void>;

  reload(): Promise<void>;
}

export function useAcademicViewModel(): AcademicViewModel {
  const services = useAppServices();

  const query = useAcademicDisciplinesQuery(services);

  const mutation = useSaveAcademicDisciplineMutation(services);

  const disciplines = query.data || [];

  const metrics = disciplines.map((discipline) => {
    return services.academic.calculateMetrics.execute({ discipline });
  });

  const save = async (input: SaveAcademicDisciplineInput): Promise<void> => {
    const discipline = createAcademicDisciplineFromForm(
      input,
      input.id ?? services.platform.ids.execute(),
      new Date()
        .toISOString(),
    );

    await mutation.mutateAsync(discipline);
  };

  const state = getQueryViewState(query);

  const remove = async (id: string): Promise<void> => {
    await services.academic.delete.execute(id);

    await query.refetch();
  };

  return {
    state,
    disciplines,
    metrics,
    error: query.error ?? null,
    save,
    saveError: mutation.error,
    remove,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}
