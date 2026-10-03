import { BrowserRouter } from "react-router-dom";
import { AppThemeProvider } from "./app-theme-provider.component";

export function ApplicationRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppThemeProvider />
    </BrowserRouter>
  );
}
