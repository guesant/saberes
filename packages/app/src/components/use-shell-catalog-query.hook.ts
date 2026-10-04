import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../composition/use-app-services.hook";

export function useShellCatalogQuery() {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["shell-catalog"],
    queryFn: () => services.catalog.get.execute({ search: "" }),
  });

  return query.data;
}
