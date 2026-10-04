import type { ApplicationServices } from "@guesant/saberes-application";
import type { ReactNode } from "react";

export interface AppServicesProviderProps {
  services: ApplicationServices;
  children?: ReactNode;
}
