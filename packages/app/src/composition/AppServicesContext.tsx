import { createContext, type PropsWithChildren, useContext } from "react";
import type { AppUseCases } from "../application/createUseCases";

const AppServicesContext = createContext<AppUseCases | null>(null);

export function AppServicesProvider({
    services,
    children,
}: PropsWithChildren<{ services: AppUseCases }>) {
    return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}

export function useAppServices() {
    const services = useContext(AppServicesContext);
    if (!services) {
        throw new Error("AppServicesProvider não foi configurado.");
    }
    return services;
}
