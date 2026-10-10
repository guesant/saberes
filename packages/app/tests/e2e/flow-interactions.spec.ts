import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("o catálogo permite buscar, filtrar e salvar um filtro local", async ({
  page,
}) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByText("Filtrar catálogo", { exact: true }).click();

  await page
    .getByPlaceholder("Encontrar curso, mapa, plano ou conteúdo")
    .fill("conceito");

  await page.getByPlaceholder("Processo").fill("processo local");

  await page.locator('input[type="number"]').first().fill("2027");

  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Filtros salvos" }).click();

  await page
    .getByRole("textbox", { name: "Nome do filtro" })
    .fill("Filtro de fluxo");

  await page.getByRole("button", { name: "Salvar filtro" }).click();

  await expect(
    page.getByRole("button", { name: "Filtro de fluxo" }),
  ).toBeVisible();

  await expect(page.getByRole("button", { name: "Excluir" })).toBeVisible();

  await page.getByRole("button", { name: "Editar" }).click();

  await page
    .getByRole("textbox", { name: "Nome do filtro" })
    .last()
    .fill("Filtro de fluxo atualizado");

  await page.getByRole("button", { name: "Atualizar filtro" }).click();

  await expect(
    page.getByRole("button", { name: "Filtro de fluxo atualizado" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Excluir" }).click();

  await expect(
    page.getByRole("button", { name: "Filtro de fluxo atualizado" }),
  ).toHaveCount(0);
});

test("o estudante inicia um curso e consegue concluir uma lição", async ({
  page,
}) => {
  await page.goto("/cursos/unicamp-2027-primeira-fase", {
    waitUntil: "networkidle",
  });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Começar curso" }).click();

  await expect(page).toHaveURL(
    /\/licoes\/unicamp-2027-2468-conceito\?course=unicamp-2027-primeira-fase&step=1$/,
  );

  await page.goBack();

  await expect(
    page.getByRole("button", { name: "Continuar curso" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Continuar curso" }).click();

  await expect(page).toHaveURL(
    /\/licoes\/unicamp-2027-2468-conceito\?course=unicamp-2027-primeira-fase&step=1$/,
  );

  await validateRouteSettled(page);

  await expect(page.getByRole("button", { name: "Salvar" })).toBeVisible();

  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByRole("button", { name: "Salva" })).toBeVisible();

  const savedNotice = page
    .getByRole("status")
    .filter({ hasText: "Salvo neste dispositivo." });

  await expect(savedNotice).toBeVisible();

  await expect(savedNotice).toBeHidden({ timeout: 5000 });

  await page.getByRole("button", { name: "Marcar como concluída" }).click();

  await expect(page.getByRole("button", { name: "Concluída" })).toBeVisible();
});

test("a ação de prática da lição leva às questões do tópico estudado", async ({
  page,
}) => {
  await page.goto("/licoes/unicamp-2027-2468-conceito", {
    waitUntil: "networkidle",
  });

  await validateRouteSettled(page);

  await page.getByRole("link", { name: "Ir para a prática" }).click();

  await expect(page).toHaveURL(
    /\/topicos\/vu27-pt-texto-funcionamento#pratica/,
  );

  await expect(page.getByRole("heading", { name: "Prática" })).toBeVisible();

  const questionLink = page.locator('#pratica a[href^="/questoes/"]').first();
  await expect(questionLink).toBeVisible();
  await questionLink.click();

  await expect(page).toHaveURL(/\/questoes\/\d+/);

  await validateRouteSettled(page);
});

test("as ações do tópico levam à teoria, à prática e aos materiais", async ({
  page,
}) => {
  await page.goto("/topicos/vu27-pt-texto-funcionamento#pratica", {
    waitUntil: "networkidle",
  });

  await validateRouteSettled(page);

  const assertTopicAnchor = async (
    label: string,
    id: string,
  ): Promise<void> => {
    const action = page.getByRole("tab", { name: label, exact: true });

    const target = page.locator(`#painel-${id}`);

    await action.click();

    await expect(page).toHaveURL(new RegExp(`#${id}$`));

    await expect(action).toHaveAttribute("aria-selected", "true");

    await expect(target).toBeVisible();
  };

  await assertTopicAnchor("Teoria", "teoria");

  await assertTopicAnchor("Prática", "pratica");

  await assertTopicAnchor("Materiais", "materiais");
});

test("ações rápidas só revelam a busca após solicitação e levam à tela escolhida", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Abrir ações rápidas" }).click();

  const palette = page.getByRole("dialog", { name: "Ações rápidas" });

  await expect(palette).toBeVisible();

  await palette
    .getByRole("textbox", { name: "Buscar uma tela" })
    .fill("Desempenho");

  await palette.getByRole("button", { name: "Desempenho" }).click();

  await expect(page).toHaveURL(/\/desempenho$/);

  await expect(page.getByRole("heading", { name: "Desempenho" })).toBeVisible();

  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("o roteiro do curso abre etapas reais preservando contexto e posição", async ({
  page,
}) => {
  await page.goto("/cursos/unicamp-2027-primeira-fase", {
    waitUntil: "networkidle",
  });

  await validateRouteSettled(page);

  const exampleStep = page
    .getByRole("link", { name: /Acompanhar um exemplo/ })
    .first();

  await expect(exampleStep).toHaveAttribute(
    "href",
    "/licoes/unicamp-2027-2468-exemplo?course=unicamp-2027-primeira-fase&step=2",
  );

  await exampleStep.click();

  await expect(page).toHaveURL(
    /\/licoes\/unicamp-2027-2468-exemplo\?course=unicamp-2027-primeira-fase&step=2$/,
  );

  await validateRouteSettled(page);
});

test("a preferência de retenção permanece fechada até abrir e persiste a alteração", async ({
  page,
}) => {
  await page.goto("/revisoes", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.getByRole("button", { name: "Ajustar meta de retenção" }).click();

  const retentionDialog = page.getByRole("dialog");

  const retention = retentionDialog.getByRole("spinbutton", {
    name: "Retenção desejada (%)",
  });

  await expect(retentionDialog).toBeVisible();

  await retention.fill("90");

  await expect(retention).toHaveValue("90");

  await page.keyboard.press("Escape");

  await expect(retentionDialog).toHaveCount(0);

  await page.reload({ waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Ajustar meta de retenção" }).click();

  await expect(page.getByRole("dialog").getByRole("spinbutton")).toHaveValue(
    "90",
  );
});

test("o estudante responde uma questão, salva e remove dos salvos e registra diagnóstico", async ({
  page,
}) => {
  await page.goto("/questoes/1", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Salvar questão" }).click();

  await expect(
    page.getByRole("button", { name: "Remover dos salvos" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Remover dos salvos" }).click();

  await expect(
    page.getByRole("button", { name: "Salvar questão" }),
  ).toHaveAttribute("aria-pressed", "false");

  // QZ 2025, question 1: the official answer is option B.
  await page.getByRole("button", { name: /^B\)/ }).click();

  await page.getByRole("button", { name: "Responder" }).click();

  const responseDialog = page.getByRole("dialog");

  await responseDialog.getByRole("button", { name: "Seguro" }).click();

  await responseDialog.getByRole("button", { name: "Enviar resposta" }).click();

  await expect(
    page.getByText("Resposta correta", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText("Resposta registrada para revisão", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Resposta incorreta", { exact: true }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Avaliar tentativa" }).click();

  const diagnosisDialog = page.getByRole("dialog");

  await diagnosisDialog
    .getByRole("button", { name: "Acertei com segurança" })
    .click();

  await diagnosisDialog
    .getByRole("button", { name: "Salvar avaliação" })
    .click();

  await expect(
    page.getByRole("button", { name: "Alterar avaliação" }),
  ).toBeVisible();
});

test("o desempenho mantém resumo e detalhes em páginas claras", async ({
  page,
}) => {
  await page.goto("/desempenho", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("link", { name: "Ver filtros e detalhes" }).click();

  await expect(page).toHaveURL(/\/desempenho\/detalhes$/);

  await expect(
    page.getByRole("heading", { name: "Detalhes do desempenho" }),
  ).toBeVisible();

  await expect(
    page.getByText("Recorte das evidências", { exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Voltar ao resumo" }).click();

  await expect(page).toHaveURL(/\/desempenho$/);
});

test("o catálogo inicia uma sessão de questões e a sessão chega a um estado terminal", async ({
  page,
}) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("tab", { name: /Conteúdos/ }).click();

  await page.getByRole("spinbutton", { name: "Quantidade" }).fill("1");

  await page.getByRole("button", { name: "Começar sessão" }).click();

  await expect(page).toHaveURL(/\/sessoes\/questoes\//);

  await validateRouteSettled(page);

  await expect(page.locator("#main-content")).toBeVisible();
});

test("o espaço pessoal cria nota, checklist, pendência e referência", async ({
  page,
}) => {
  await page.goto("/meu-espaco", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Nota", exact: true }).click();

  await page
    .getByRole("textbox", { name: "Título da nota" })
    .fill("Nota de fluxo");

  await page
    .getByRole("textbox", { name: "Texto da nota" })
    .fill("Conteúdo da nota");

  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  await page.getByRole("button", { name: "Lista", exact: true }).click();

  await page
    .getByRole("textbox", { name: "Título do checklist" })
    .fill("Checklist de fluxo");

  await page
    .getByRole("textbox", { name: "Itens, um por linha" })
    .fill("Primeiro item\nSegundo item");

  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  await page.getByRole("button", { name: "Lembrete", exact: true }).click();

  await page
    .getByRole("textbox", { name: "Título da pendência" })
    .fill("Pendência de fluxo");

  await page
    .getByRole("textbox", { name: "Descrição" })
    .fill("Descrição da pendência");

  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  await page.getByRole("button", { name: "Referência", exact: true }).click();

  await page
    .getByRole("textbox", { name: "Título da referência" })
    .fill("Referência de fluxo");

  await page
    .getByRole("textbox", { name: "Fonte ou endereço" })
    .fill("https://example.test");

  await page.getByRole("button", { name: "Salvar", exact: true }).click();

  await expect(
    page.getByText("Nota de fluxo", { exact: true }).last(),
  ).toBeVisible();

  await expect(
    page.getByText("Checklist de fluxo", { exact: true }).last(),
  ).toBeVisible();

  await expect(
    page.getByText("Pendência de fluxo", { exact: true }).last(),
  ).toBeVisible();

  await expect(
    page.getByText("Referência de fluxo", { exact: true }).last(),
  ).toBeVisible();
});

test("metas, foco, situação acadêmica, preferências e agenda executam seus fluxos", async ({
  page,
}) => {
  await page.goto("/metas", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByText("Nova meta", { exact: true }).click();

  await page.getByRole("textbox", { name: "Título" }).fill("Meta de fluxo");

  await page.getByRole("spinbutton", { name: "Quantidade alvo" }).fill("5");

  await page.getByRole("button", { name: "Criar meta" }).click();

  await expect(page.getByText("Meta de fluxo")).toBeVisible();

  await page.goto("/foco", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Iniciar foco" }).click();

  await expect(page.getByRole("button", { name: "Pausar foco" })).toBeEnabled();

  await page.getByRole("button", { name: "Pausar foco" }).click();

  await page.getByRole("button", { name: "Retomar foco" }).click();

  await page.getByRole("button", { name: "Encerrar foco" }).click();

  await page.goto("/academico", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Nova disciplina" }).click();

  await page
    .getByRole("textbox", { name: "Nome", exact: true })
    .fill("Disciplina de fluxo");

  await page.getByRole("spinbutton", { name: "Aulas previstas" }).fill("10");

  await page.getByRole("spinbutton", { name: "Aulas presentes" }).fill("8");

  await page.getByRole("button", { name: "Salvar disciplina" }).click();

  await expect(page.getByText("Disciplina de fluxo")).toBeVisible();

  await page.getByRole("button", { name: "Editar" }).click();

  await page
    .getByRole("textbox", { name: "Nome", exact: true })
    .fill("Disciplina editada");

  await page.getByRole("button", { name: "Salvar disciplina" }).click();

  await expect(page.getByText("Disciplina editada")).toBeVisible();

  await page.goto("/preferencias", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const recommendations = page.getByRole("switch", { name: "Recomendações" });

  const initialRecommendations = await recommendations.isChecked();

  await recommendations.click();

  await expect(recommendations).toBeChecked({
    checked: !initialRecommendations,
  });

  await page.getByRole("button", { name: "Nunca" }).click();

  await expect(page.getByRole("button", { name: "Nunca" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.reload({ waitUntil: "networkidle" });

  await expect(page.getByRole("switch", { name: "Recomendações" })).toBeChecked(
    { checked: !initialRecommendations },
  );

  await expect(page.getByRole("button", { name: "Nunca" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Restaurar padrões" }).click();

  await page.goto("/agenda", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const calendarReferenceDate = await page
    .getByRole("textbox", { name: "Data de referência" })
    .inputValue();

  await page.getByText("Adicionar compromisso", { exact: true }).click();

  await page
    .getByRole("textbox", { name: "Título", exact: true })
    .fill("Compromisso de fluxo");

  await page
    .getByRole("textbox", { name: "Início" })
    .fill(calendarReferenceDate);

  await page.getByRole("button", { name: "Adicionar à agenda" }).click();

  await expect(page.getByText("Compromisso de fluxo")).toBeVisible();

  await page.getByRole("button", { name: "Editar" }).click();

  const calendarDialog = page.getByRole("dialog");

  await calendarDialog
    .getByRole("textbox", { name: "Título", exact: true })
    .fill("Compromisso editado");

  await calendarDialog.getByRole("button", { name: "Editar" }).click();

  await expect(page.getByText("Compromisso editado")).toBeVisible();

  await page.getByRole("button", { name: "Excluir" }).click();

  await expect(page.getByText("Compromisso editado")).toHaveCount(0);

  await page.getByRole("button", { name: "Semana" }).click();

  await expect(page.getByRole("button", { name: "Semana" })).toHaveClass(
    /MuiButton-contained/u,
  );

  await page.getByRole("button", { name: "Mês" }).click();

  await expect(page.getByRole("button", { name: "Mês" })).toHaveClass(
    /MuiButton-contained/u,
  );

  await page.getByRole("button", { name: "Dia" }).click();

  await expect(page.getByRole("button", { name: "Dia" })).toHaveClass(
    /MuiButton-contained/u,
  );
});
