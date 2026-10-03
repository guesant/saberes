import { createApplication } from "@guesant/saberes-application";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../query-client.config";
import { AppServicesProvider } from "./app-services-provider.component";
import { ApplicationRouter } from "./application-router.component";
import { createAppDependencies } from "./create-app-dependencies.composition";

const dependencies = createAppDependencies();

const services = createApplication(dependencies);

export function ApplicationRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider services={services}>
        <ApplicationRouter />
      </AppServicesProvider>
    </QueryClientProvider>
  );
}
