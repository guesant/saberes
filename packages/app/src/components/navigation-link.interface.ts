import type { ReactElement } from "react";

export interface NavigationLink {
  icon: ReactElement;
  label: string;
  to: string;
}
