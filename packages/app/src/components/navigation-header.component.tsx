import {
  AppBar,
  Box,
  Chip,
  IconButton,
  MenuIcon,
  OfflineBoltIcon,
  Toolbar,
  Typography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NavigationButton } from "./navigation-button.component";

export type NavigationHeaderProps = {
  links: Array<{ label: string; to: string }>;
  onOpenMenu: () => void;
};

export function NavigationHeader(props: NavigationHeaderProps) {
  const { t } = useTranslation();

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <IconButton
          aria-label={t("common.openMenu")}
          color="inherit"
          edge="start"
          onClick={props.onOpenMenu}
        >
          <MenuIcon />
        </IconButton>

        <Typography component={Link} sx={{ flexGrow: 1, ml: 1 }} to="/" variant="h6">
          {t("brand.name")}
        </Typography>

        <Box sx={{ display: { md: "flex", xs: "none" }, gap: 1 }}>
          {props.links.map((link) => (
            <NavigationButton key={link.to} label={link.label} to={link.to} />
          ))}
        </Box>

        <Chip icon={<OfflineBoltIcon />} label={t("common.offline")} size="small" />
      </Toolbar>
    </AppBar>
  );
}
