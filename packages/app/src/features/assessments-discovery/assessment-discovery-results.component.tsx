import { CatalogGrid } from "../catalog/catalog-grid.component";
import { AssessmentDiscoveryEmpty } from "./assessment-discovery-empty.component";
import type { CatalogCard } from "@guesant/saberes-application";

export interface AssessmentDiscoveryResultsProps {
  items: CatalogCard[];
}

export function AssessmentDiscoveryResults(props: AssessmentDiscoveryResultsProps) {
  if (!props.items.length) {
    return <AssessmentDiscoveryEmpty />;
  }

  return <CatalogGrid items={props.items} />;
}
