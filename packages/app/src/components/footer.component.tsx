import { Box } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ color: "text.secondary", py: 4, textAlign: "center" }}>
      {t("brand.name")} ·{t("brand.footer")}
    </Box>
  );
}
