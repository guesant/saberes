import { useContext } from "react";
import { AppServicesContext } from "./app-services-context.component";

export function useAppServices() {
  const services = useContext(AppServicesContext);

  if (!services) {
    throw new Error("AppServicesProvider não foi configurado.");
  }

  return services;
}
