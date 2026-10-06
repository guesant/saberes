import { buttonBaseThemeOverrides } from "./button-base-theme-overrides.config";
import { buttonThemeOverrides } from "./button-theme-overrides.config";
import { cardThemeOverrides } from "./card-theme-overrides.config";
import { createTheme } from "./create-theme.function";
import { cssBaselineConfig } from "./css-baseline.config";
import { tabsThemeOverrides } from "./tabs-theme-overrides.config";

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#566170", contrastText: "#fff" },
        secondary: { main: "#68717d", contrastText: "#fff" },
        background: { default: "#f5f6f8", paper: "#fff" },
        text: { primary: "#202329", secondary: "#5f6671" },
        success: { main: "#2e7d5b" },
        divider: "#d3d8e0",
      },
    },
    dark: {
      palette: {
        primary: { main: "#b9c2cf", contrastText: "#121417" },
        secondary: { main: "#aeb6c1", contrastText: "#121417" },
        background: { default: "#121417", paper: "#1b1e23" },
        text: { primary: "#f3f4f6", secondary: "#b9c0ca" },
        success: { main: "#72c49a" },
        divider: "#515b68",
      },
    },
  },
  typography: {
    fontFamily: "Roboto Slab, Georgia, serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: { fontSize: "1.25rem", fontWeight: 700 },
    h4: { fontSize: "1.125rem", fontWeight: 700 },
    h5: { fontSize: "1.125rem", fontWeight: 700 },
    h6: { fontSize: "1rem", fontWeight: 700 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: { styleOverrides: cssBaselineConfig },
    ...cardThemeOverrides,
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: "0.25rem", backgroundImage: "none" },
        outlined: { borderColor: "var(--mui-palette-divider)", borderWidth: 1 },
      },
    },
    MuiFormControl: { styleOverrides: { root: { maxWidth: "100%", minWidth: 0 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { maxWidth: "100%", minWidth: 0 },
        input: { boxSizing: "content-box", minWidth: 0 },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere" },
        h1: { fontSize: "1.75rem", "@media (min-width: 900px)": { fontSize: "2rem" } },
      },
    },
    ...tabsThemeOverrides,
    ...buttonThemeOverrides,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1b1e23",
          color: "#fff",
          boxShadow: "none",
          borderBlockEnd: "1px solid var(--mui-palette-divider)",
        },
      },
    },
    ...buttonBaseThemeOverrides,
    MuiIconButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: "0.25rem",
          border: "1px solid transparent",
          minHeight: 44,
          minWidth: 44,
          "&.UIIconButton-toggle": { borderColor: "var(--mui-palette-divider)" },
          "&.UIIconButton-shape-round": { borderRadius: "50%" },
          "&.UIIconButton-toggle[aria-pressed='true']": {
            backgroundColor: "var(--mui-palette-action-selected)",
            outline: "1px solid var(--mui-palette-primary-main)",
            outlineOffset: -1,
          },
        },
      },
    },
    MuiListItemButton: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { minHeight: 44 } },
    },
    MuiStepButton: { defaultProps: { disableRipple: true } },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
        standardInfo: {
          backgroundColor: "var(--mui-palette-action-hover)",
          border: "1px solid var(--mui-palette-divider)",
          color: "var(--mui-palette-text-primary)",
          "& .MuiAlert-icon": { color: "var(--mui-palette-primary-main)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: "0.25rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: "0.25rem" },
      },
    },
  },
});
