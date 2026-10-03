import {
  ThemeProvider as MuiThemeProvider,
  type ThemeProviderProps as MuiThemeProviderProps,
} from "@mui/material/styles";
import type { ReactElement } from "react";

export type ThemeProviderProps = MuiThemeProviderProps;

export function ThemeProvider(props: ThemeProviderProps): ReactElement {
  return <MuiThemeProvider {...props} />;
}
