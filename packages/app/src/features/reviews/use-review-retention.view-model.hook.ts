import { useQuery } from "@tanstack/react-query";
import { getReviewRetention } from "./get-review-retention.function";
import type { ReviewRetentionViewModel } from "./review-retention-view-model.interface";
import type { UseReviewRetentionViewModelInput } from "./use-review-retention-view-model-input.interface";

export function useReviewRetentionViewModel(
  input: UseReviewRetentionViewModelInput,
): ReviewRetentionViewModel {
  const query = useQuery({
    queryKey: ["settings", "review-retention"],
    queryFn: async () => {
      const setting = await input.services.progress.getSetting.execute("reviewRetention");

      return setting ?? null;
    },
  });

  const retention = getReviewRetention(query.data?.value);

  const setRetention = async (value: number): Promise<void> => {
    const nextRetention = getReviewRetention(value);

    await input.services.progress.saveSetting.execute({
      key: "reviewRetention",
      value: nextRetention,
    });

    await input.queryClient.invalidateQueries({ queryKey: ["settings", "review-retention"] });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "reviews"] });
  };

  return { retention, setRetention };
}
