import { createContext } from "react";
import type { ApplicationServices } from "@guesant/saberes-application";

export const AppServicesContext = createContext<ApplicationServices | null>(null);
