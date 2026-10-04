import {
  ThemeProvider as MuiThemeProvider,
  type ThemeProviderProps as MuiThemeProviderProps,
} from "@mui/material/styles";
import type { ReactElement } from "react";

export type UIThemeProviderProps = MuiThemeProviderProps;

export function UIThemeProvider(props: UIThemeProviderProps): ReactElement {
  return <MuiThemeProvider {...props} />;
}
