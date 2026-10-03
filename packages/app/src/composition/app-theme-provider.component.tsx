import { CssBaseline, ThemeProvider } from "@guesant/saberes-ui";
import { App } from "../app.component";
import { theme } from "../theme.config";

export function AppThemeProvider() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <App />
    </ThemeProvider>
  );
}
