import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AcademicDiscipline, ApplicationServices } from "@guesant/saberes-application";

export function useSaveAcademicDisciplineMutation(services: ApplicationServices) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discipline: AcademicDiscipline) => services.academic.save.execute(discipline),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["academic", "disciplines"] });
    },
  });
}
