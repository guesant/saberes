import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApplicationServices, FocusSession } from "@guesant/saberes-application";

export function useSaveFocusSessionMutation(services: ApplicationServices) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: FocusSession) => {
      return services.focus.save.execute(session);
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["study", "focus"] });
    },
  });
}
