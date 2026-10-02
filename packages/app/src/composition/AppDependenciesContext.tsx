import { createContext, type PropsWithChildren, useContext } from "react";
import type { AppDependencies } from "@guesant/saberes-core";

const AppDependenciesContext = createContext<AppDependencies | null>(null);

export function AppDependenciesProvider({
    dependencies,
    children,
}: PropsWithChildren<{ dependencies: AppDependencies }>) {
    return (
        <AppDependenciesContext.Provider value={dependencies}>
            {children}
        </AppDependenciesContext.Provider>
    );
}

export function useAppDependencies() {
    const dependencies = useContext(AppDependenciesContext);
    if (!dependencies) {
        throw new Error("AppDependenciesProvider não foi configurado.");
    }
    return dependencies;
}
