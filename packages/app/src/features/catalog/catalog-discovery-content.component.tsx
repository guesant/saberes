import { UIContentGroup } from "@guesant/saberes-ui";
import { CatalogQuestionSessionLauncher } from "../exercises/catalog-question-session-launcher.component";
import { CatalogPracticeHeading } from "./catalog-practice-heading.component";
import { CatalogResults } from "./catalog-results.component";
import { CatalogTabs } from "./catalog-tabs.component";
import { getCatalogDiscoveryItems } from "./get-catalog-discovery-items.function";
import { getCatalogQuestionItemsForTab } from "./get-catalog-question-items-for-tab.function";
import { useCatalogDiscoveryTab } from "./use-catalog-discovery-tab.hook";
import type { CatalogReadModel } from "@guesant/saberes-application";

export interface CatalogDiscoveryContentProps {
  catalog: CatalogReadModel;
}

export function CatalogDiscoveryContent(props: CatalogDiscoveryContentProps) {
  const discovery = useCatalogDiscoveryTab();

  const items = getCatalogDiscoveryItems({ catalog: props.catalog, tab: discovery.tab, mode: discovery.mode });

  return (
    <UIContentGroup variant="section">
      {discovery.mode === "praticar" && <CatalogPracticeHeading />}
      <CatalogTabs catalog={props.catalog} tab={discovery.tab} onTabChange={discovery.setTab} />
      <CatalogQuestionSessionLauncher questions={getCatalogQuestionItemsForTab({ items: props.catalog.content, tab: discovery.tab })} />
      <CatalogResults items={items} />
    </UIContentGroup>
  );
}
