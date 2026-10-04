import { UICssBaseline, UIThemeProvider } from "@guesant/saberes-ui";
import { App } from "../app.component";
import { theme } from "../theme.config";

export function AppThemeProvider() {
  return (
    <UIThemeProvider theme={theme}>
      <UICssBaseline />

      <App />
    </UIThemeProvider>
  );
}
