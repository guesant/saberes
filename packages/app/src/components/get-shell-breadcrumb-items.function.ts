import { normalizeShellBreadcrumbPath } from "./normalize-shell-breadcrumb-path.function";
import type { ShellBreadcrumbDefinition } from "./shell-breadcrumb-definition.interface";
import type { ShellBreadcrumbItem } from "./shell-breadcrumb-item.interface";
import type { ShellTranslator } from "./shell-translator.type";

const routeDefinitions: Record<string, ShellBreadcrumbDefinition[]> = {
  "/": [{ labelKey: "nav.home" }],
  "/academico": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.academic" }],
  "/agenda": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.calendar" }],
  "/cursos/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.catalog", to: "/catalogo" },
    { labelKey: "nav.course" },
  ],
  "/desempenho": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.performance" }],
  "/desempenho/detalhes": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.performance", to: "/desempenho" },
    { labelKey: "nav.details" },
  ],
  "/exercicios/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.simulator", to: "/provas" },
    { labelKey: "nav.questions" },
  ],
  "/foco": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.focus" }],
  "/licoes/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.myStudy", to: "/meu-estudo" },
    { labelKey: "nav.lesson" },
  ],
  "/mapa/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.catalog", to: "/catalogo" },
    { labelKey: "nav.map" },
  ],
  "/meu-espaco": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.personal" }],
  "/meu-estudo": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.myStudy" }],
  "/metas": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.goals" }],
  "/plano/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.catalog", to: "/catalogo" },
    { labelKey: "nav.studyPlan" },
  ],
  "/preferencias": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.preferences" }],
  "/provas": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.simulator" }],
  "/questoes/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.simulator", to: "/provas" },
    { labelKey: "nav.questions" },
  ],
  "/revisoes": [{ labelKey: "nav.home", to: "/" }, { labelKey: "nav.review" }],
  "/sessoes/questoes/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.simulator", to: "/provas" },
    { labelKey: "nav.questionSession" },
  ],
  "/topicos/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.catalog", to: "/catalogo" },
    { labelKey: "nav.topics" },
  ],
  "/avaliacoes/:id": [
    { labelKey: "nav.home", to: "/" },
    { labelKey: "nav.simulator", to: "/provas" },
    { labelKey: "nav.assessment" },
  ],
};

export function getShellBreadcrumbItems(
  pathname: string,
  translate: ShellTranslator,
): ShellBreadcrumbItem[] {
  const routeKey = normalizeShellBreadcrumbPath(pathname);

  const definitions = routeDefinitions[routeKey] ?? routeDefinitions["/"];

  return definitions.map((item) => {
    return { label: translate(item.labelKey), to: item.to };
  });
}
