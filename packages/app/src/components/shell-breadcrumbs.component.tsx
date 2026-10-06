import { UIBreadcrumbs } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getShellBreadcrumbItems } from "./get-shell-breadcrumb-items.function";
import { ShellBreadcrumbCrumb } from "./shell-breadcrumb-crumb.component";

export function ShellBreadcrumbs() {
  const { t } = useTranslation();

  const location = useLocation();

  const items = getShellBreadcrumbItems(location.pathname, t);

  return (
    <UIBreadcrumbs ariaLabel={t("common.breadcrumbNavigation")}>
      {items.map((item, index) => {
        return (
          <ShellBreadcrumbCrumb
            current={index === items.length - 1}
            item={item}
            key={item.to ?? item.label}
          />
        );
      })}
    </UIBreadcrumbs>
  );
}
