import { createTheme } from "./create-theme.function";

export const theme = createTheme({
  palette: {
    primary: { main: "#152a4a", contrastText: "#fff" },
    secondary: { main: "#e59b2f" },
    background: { default: "#f7f8fb", paper: "#fff" },
    success: { main: "#2e7d5b" },
  },
  typography: {
    fontFamily: "Roboto Slab, Georgia, serif",
    h1: {
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontSize: "clamp(1.75rem, 4vw, 3rem)",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: { fontSize: "clamp(1.5rem, 3.5vw, 2.125rem)", fontWeight: 700 },
    h4: { fontSize: "clamp(1.35rem, 3vw, 1.8rem)" },
    h5: { fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)" },
    h6: { fontSize: "clamp(1.1rem, 2vw, 1.25rem)" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e5e8ef",
          borderRadius: "0.25rem",
          boxShadow: "0 8px 28px rgba(21,42,74,.06)",
          boxSizing: "border-box",
          maxWidth: "100%",
          minWidth: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: { maxWidth: "100%", minWidth: 0 },
      },
    },
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
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { maxWidth: "100%", minWidth: 0, width: "100%" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: { root: { borderRadius: "0.25rem" } },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiIconButton: { defaultProps: { disableRipple: true } },
    MuiListItemButton: { defaultProps: { disableRipple: true } },
    MuiStepButton: { defaultProps: { disableRipple: true } },
    MuiTab: { defaultProps: { disableRipple: true } },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: "0.25rem" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: "0.25rem" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: "0.25rem" },
      },
    },
  },
});
