import type { CatalogFilters, CatalogReadModel } from "@guesant/saberes-core";
import type { ContentPort } from "@guesant/saberes-core";

export function createGetCatalogUseCase(content: ContentPort) {
    return (filters: CatalogFilters = {}): Promise<CatalogReadModel> =>
        content.getCatalog(filters);
}
