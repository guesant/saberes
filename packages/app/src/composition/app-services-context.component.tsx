import { createContext, type PropsWithChildren } from "react";
import type { ApplicationServices } from "@guesant/saberes-application";

export const AppServicesContext = createContext<ApplicationServices | null>(null);

type AppServicesProviderProps = PropsWithChildren<{ services: ApplicationServices }>;

export function AppServicesProvider(props: AppServicesProviderProps) {
  const { services, children } = props;

  return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}
