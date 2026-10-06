import "@guesant/saberes-ui/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { checkServiceWorkerUpdate } from "./check-service-worker-update.function";
import "./i18n";
import { Main } from "./main.component";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root element was not found.");
}

const applicationRoot = createRoot(root);

applicationRoot.render(
  React.createElement(React.StrictMode, null, React.createElement(Main, {})),
);

checkServiceWorkerUpdate(registerSW);
