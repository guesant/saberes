import { theme, UICssBaseline, UIThemeProvider } from "@guesant/saberes-ui";
import { App } from "../app.component";

export function AppThemeProvider() {
  return (
    <UIThemeProvider theme={theme}>
      <UICssBaseline />

      <App />
    </UIThemeProvider>
  );
}
