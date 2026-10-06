import type { Components, Theme } from "@mui/material/styles";

export const buttonBaseThemeOverrides = {
  MuiButtonBase: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: {
        "&.Mui-focusVisible": {
          outline: "3px solid var(--mui-palette-primary-main)",
          outlineOffset: "2px",
        },
      },
    },
  },
} satisfies Components<Theme>;
