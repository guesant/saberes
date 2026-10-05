import { theme, UICssBaseline, UIThemeProvider } from "@guesant/saberes-ui";
import { App } from "../app.component";

export function AppThemeProvider() {
  return (
    <UIThemeProvider defaultMode="system" disableTransitionOnChange theme={theme}>
      <UICssBaseline />

      <App />
    </UIThemeProvider>
  );
}
