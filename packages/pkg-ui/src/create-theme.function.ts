import { createTheme as createMuiTheme, type Theme, type ThemeOptions } from "@mui/material/styles";

export function createTheme(options?: ThemeOptions): Theme {
  return createMuiTheme(options);
}
