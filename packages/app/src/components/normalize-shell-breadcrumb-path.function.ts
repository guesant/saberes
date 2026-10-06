export function normalizeShellBreadcrumbPath(pathname: string): string {
  const dynamicRoute = pathname.match(
    /^\/(cursos|plano|mapa|topicos|licoes|questoes|exercicios|avaliacoes)\/[^/]+$/u,
  );

  if (dynamicRoute) {
    return `/${dynamicRoute[1]}/:id`;
  }

  if (/^\/sessoes\/questoes\/[^/]+$/u.test(pathname)) {
    return "/sessoes/questoes/:id";
  }

  return pathname;
}
