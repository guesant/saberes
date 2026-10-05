import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import type { CatalogSavedFilterDeleteAction } from "./catalog-saved-filter-delete-action.interface";

export function useCatalogSavedFilterDeleteAction(): CatalogSavedFilterDeleteAction {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string): Promise<void> => {
      return services.progress.deleteSavedCatalogFilter.execute(id);
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["catalog", "saved-filters"] });
    },
  });

  return {
    delete: (id: string): Promise<void> => { return mutation.mutateAsync(id); },
    error: mutation.error ?? null,
    pending: mutation.isPending,
  };
}
