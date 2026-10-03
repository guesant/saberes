import { Box, Container, Drawer } from "@guesant/saberes-ui";
import { useState } from "react";
import { Footer } from "./footer.component";
import { NavigationDrawer } from "./navigation-drawer.component";
import { NavigationHeader } from "./navigation-header.component";
import type { ReactNode } from "react";

export type ShellProps = {
  children: ReactNode;
};

export function Shell(props: ShellProps) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Catálogo", to: "/catalogo" },
    { label: "Plano", to: "/plano" },
    { label: "Mapa", to: "/mapa" },
    { label: "Meu estudo", to: "/meu-estudo" },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <NavigationHeader links={links} onOpenMenu={() => setOpen(true)} />

      <Drawer onClose={() => setOpen(false)} open={open}>
        <NavigationDrawer links={links} onSelect={() => setOpen(false)} />
      </Drawer>

      <Container maxWidth="lg" sx={{ py: { md: 5, xs: 3 } }}>
        {props.children}
      </Container>

      <Footer />
    </Box>
  );
}
