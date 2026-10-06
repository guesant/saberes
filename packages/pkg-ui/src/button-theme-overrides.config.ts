import type { Components, Theme } from "@mui/material/styles";

export const buttonThemeOverrides = {
  MuiButton: {
    defaultProps: { disableElevation: true, disableRipple: true },
    styleOverrides: {
      root: {
        borderRadius: "0.25rem",
        boxSizing: "border-box",
        flexShrink: 1,
        height: 44,
        maxWidth: "100%",
        minHeight: 44,
        minWidth: 0,
        overflow: "hidden",
        textAlign: "center",
        whiteSpace: "nowrap",
        "& .UIButton-label": {
          display: "block",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        "& .MuiButton-startIcon, & .MuiButton-endIcon": { flexShrink: 0 },
        "&.UIButton-iconOnly": {
          borderRadius: "0.25rem",
          minWidth: 44,
          padding: 0,
          width: 44,
          "& .MuiButton-startIcon": { margin: 0 },
          "& .UIButton-label": {
            clip: "rect(0, 0, 0, 0)",
            clipPath: "inset(50%)",
            height: 1,
            overflow: "hidden",
            position: "absolute",
            whiteSpace: "nowrap",
            width: 1,
          },
        },
        "&.UIButton-iconOnly-round": { borderRadius: "50%" },
        "&.UIButton-iconOnly.UIButton-toggle": {
          border: "1px solid var(--mui-palette-divider)",
        },
        "&.UIButton-toggle[aria-pressed='true']": {
          backgroundColor: "var(--mui-palette-action-selected)",
          borderColor: "var(--mui-palette-primary-main)",
        },
        "&.UISimulationAnswerOption-root[aria-pressed='true']": {
          backgroundColor: "var(--mui-palette-action-selected)",
          borderColor: "var(--mui-palette-primary-main)",
        },
        "&.UISimulationAnswerOption-root": {
          alignItems: "flex-start",
          height: "auto",
          justifyContent: "flex-start",
          minHeight: 56,
          overflow: "visible",
          textAlign: "left",
          whiteSpace: "normal",
        },
      },
    },
  },
} satisfies Components<Theme>;
