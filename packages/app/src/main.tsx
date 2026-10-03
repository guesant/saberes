// @ts-nocheck
import "@fontsource/roboto-slab/400.css";
import "@fontsource/roboto-slab/500.css";
import "@fontsource/roboto-slab/600.css";
import "@fontsource/roboto-slab/700.css";
import "katex/dist/katex.min.css";
import { registerSW } from "virtual:pwa-register";
import { loadContentDatabase } from "@guesant/saberes-adapter-data-v1";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { createApplication } from "@guesant/saberes-application";
import { AppServicesProvider } from "./composition/AppServicesContext";
import { createAppDependencies } from "./composition/createAppDependencies";
import { ContentProvider } from "./db/ContentContext";
import { queryClient } from "./queryClient";
import { theme } from "./theme";
import "./i18n";

const dependencies = createAppDependencies();
const services = createApplication(dependencies);

registerSW({ immediate: true });

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppServicesProvider services={services}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <BrowserRouter basename={import.meta.env.BASE_URL}>
                        <ContentProvider loadDatabase={loadContentDatabase}>
                            <App />
                        </ContentProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </AppServicesProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
