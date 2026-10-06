import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../composition/use-app-services.hook";
import { createCatalogContentReferenceOptions } from "./create-catalog-content-reference-options.function";
import { createTopicContentReferenceOptions } from "./create-topic-content-reference-options.function";

export function useContentReferenceOptions() {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["content-reference-options"],
    queryFn: async () => {
      const catalog = await services.catalog.get.execute({ search: "" });

      const maps = await Promise.all(catalog.maps.map(async (item) => {
        return item.slug ? services.maps.get.execute(item.slug) : null;
      }));

      return { catalog, maps };
    },
    staleTime: Infinity,
  });

  const catalogOptions = query.data ? createCatalogContentReferenceOptions(query.data.catalog) : [];

  const topicOptions = createTopicContentReferenceOptions(query.data?.maps ?? []);

  return { ...query, options: [...catalogOptions, ...topicOptions] };
}
