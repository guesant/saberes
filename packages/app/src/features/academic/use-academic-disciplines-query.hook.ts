import { useQuery } from "@tanstack/react-query";
import type { AcademicDiscipline, ApplicationServices } from "@guesant/saberes-application";

export function useAcademicDisciplinesQuery(services: ApplicationServices) {
  return useQuery<AcademicDiscipline[], Error>({
    queryKey: ["academic", "disciplines"],
    queryFn: () => services.academic.list.execute(),
  });
}
