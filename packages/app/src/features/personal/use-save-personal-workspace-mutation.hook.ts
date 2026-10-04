import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function useSavePersonalWorkspaceMutation() {
  const services = useAppServices();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspace: PersonalWorkspace) => {
      return services.personal.save.execute(workspace);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["personal-workspace"] });
    },
  });
}
