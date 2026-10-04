import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";

export function usePersonalWorkspaceQuery() {
  const services = useAppServices();

  return useQuery({
    queryKey: ["personal-workspace"],
    queryFn: () => {
      return services.personal.get.execute();
    },
    staleTime: Infinity,
  });
}
