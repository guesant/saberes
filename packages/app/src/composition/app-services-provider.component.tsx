import { AppServicesContext } from "./app-services-context.setup";
import type { ApplicationServices } from "@guesant/saberes-application";
import type { PropsWithChildren } from "react";

type AppServicesProviderProps = PropsWithChildren<{ services: ApplicationServices }>;

export function AppServicesProvider(props: AppServicesProviderProps) {
  const { services, children } = props;

  return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}
