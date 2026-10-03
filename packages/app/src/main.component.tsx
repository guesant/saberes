import "@guesant/saberes-ui/styles";
import "@guesant/saberes-ui-content/styles";
import React from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { ApplicationRoot } from "./composition/application-root.component";
import "./i18n";

registerSW({ immediate: true });

const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root element was not found.");
}

createRoot(root).render(
  <React.StrictMode>
    <ApplicationRoot />
  </React.StrictMode>,
);
