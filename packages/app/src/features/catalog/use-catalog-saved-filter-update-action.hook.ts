import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import type { CatalogSavedFilterUpdateAction } from "./catalog-saved-filter-update-action.interface";
import type { UpdateCatalogSavedFilterInput } from "./update-catalog-saved-filter-input.interface";

export function useCatalogSavedFilterUpdateAction(): CatalogSavedFilterUpdateAction {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: UpdateCatalogSavedFilterInput): Promise<void> => {
      await services.progress.saveSavedCatalogFilter.execute({
        ...input.filter,
        name: input.name,
        updatedAt: new Date()
          .toISOString(),
      });
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["catalog", "saved-filters"] });
    },
  });

  return {
    error: mutation.error ?? null,
    pending: mutation.isPending,
    update: (filter, name): Promise<void> => { return mutation.mutateAsync({ filter, name }); },
  };
}
