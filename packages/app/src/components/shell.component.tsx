import { UIDrawer, UIPageContent, UIPageSurface } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "./footer.component";
import { NavigationDrawer } from "./navigation-drawer.component";
import { NavigationHeader } from "./navigation-header.component";
import type { ReactNode } from "react";

export type ShellProps = {
  children: ReactNode;
};

export function Shell(props: ShellProps) {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const links = [
    { label: t("common.catalog"), to: "/catalogo" },
    { label: t("common.review"), to: "/revisoes" },
    { label: t("common.myStudy"), to: "/meu-estudo" },
    { label: t("nav.performance"), to: "/desempenho" },
  ];

  return (
    <UIPageSurface>
      <NavigationHeader links={links} onOpenMenu={() => setOpen(true)} />

      <UIDrawer onClose={() => setOpen(false)} open={open}>
        <NavigationDrawer links={links} onSelect={() => setOpen(false)} />
      </UIDrawer>

      <UIPageContent>{props.children}</UIPageContent>

      <Footer />
    </UIPageSurface>
  );
}
