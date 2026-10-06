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
        "& [data-ui-button-label]": {
          display: "block",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        "& .MuiButton-startIcon, & .MuiButton-endIcon": { flexShrink: 0 },
        "&[data-ui-control='choice']": {
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
