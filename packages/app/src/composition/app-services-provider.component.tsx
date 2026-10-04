import { AppServicesContext } from "./app-services-context.setup";
import type { AppServicesProviderProps } from "./app-services-provider-props.interface";

export function AppServicesProvider(props: AppServicesProviderProps) {
  const { services, children } = props;

  return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}
