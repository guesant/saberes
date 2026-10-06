import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCatalogDiscoveryTab } from "./get-catalog-discovery-tab.function";

export function useCatalogDiscoveryTab() {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("modo");

  const [tab, setTab] = useState(getCatalogDiscoveryTab(mode));

  useEffect(() => {
    setTab(getCatalogDiscoveryTab(mode));
  }, [mode]);

  return { tab, setTab, mode };
}
