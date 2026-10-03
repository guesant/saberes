import { createContext, type PropsWithChildren, useContext } from "react";
import type { ApplicationServices } from "@guesant/saberes-application";

const AppServicesContext = createContext<ApplicationServices | null>(null);

export function AppServicesProvider({
    services,
    children,
}: PropsWithChildren<{ services: ApplicationServices }>) {
    return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}

export function useAppServices() {
    const services = useContext(AppServicesContext);
    if (!services) {
        throw new Error("AppServicesProvider não foi configurado.");
    }
    return services;
}
