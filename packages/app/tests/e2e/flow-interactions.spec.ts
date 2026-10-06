import { expect, test } from "@playwright/test";
import { validateRouteSettled } from "./validate-route-settled.function";

test("o catálogo permite buscar, filtrar e salvar um filtro local", async ({ page }) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByText("Filtrar catálogo", { exact: true })
    .click();

  await page.getByPlaceholder("Encontrar curso, mapa, plano ou conteúdo")
    .fill("conceito");

  await page.getByPlaceholder("Processo")
    .fill("processo local");

  await page.locator('input[type="number"]')
    .first()
    .fill("2027");

  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Filtros salvos" })
    .click();

  await page.getByRole("textbox", { name: "Nome do filtro" })
    .fill("Filtro de fluxo");

  await page.getByRole("button", { name: "Salvar filtro" })
    .click();

  await expect(page.getByRole("button", { name: "Filtro de fluxo" }))
    .toBeVisible();

  await expect(page.getByRole("button", { name: "Excluir" }))
    .toBeVisible();

  await page.getByRole("button", { name: "Editar" })
    .click();

  await page.getByRole("textbox", { name: "Nome do filtro" })
    .last()
    .fill("Filtro de fluxo atualizado");

  await page.getByRole("button", { name: "Atualizar filtro" })
    .click();

  await expect(page.getByRole("button", { name: "Filtro de fluxo atualizado" }))
    .toBeVisible();

  await page.getByRole("button", { name: "Excluir" })
    .click();

  await expect(page.getByRole("button", { name: "Filtro de fluxo atualizado" }))
    .toHaveCount(0);
});

test("o estudante inicia um curso e consegue concluir uma lição", async ({ page }) => {
  await page.goto("/cursos/fundamentos-para-vestibulares", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Começar curso" })
    .click();

  await expect(page.getByRole("button", { name: "Continuar curso" }))
    .toBeVisible();

  await page.getByText("Aprenda em sequência", { exact: true })
    .click();

  await page.locator('a[href^="/licoes/"]')
    .first()
    .click();

  await validateRouteSettled(page);

  await expect(page.getByRole("button", { name: "Salvar" }))
    .toBeVisible();

  await page.getByRole("button", { name: "Salvar" })
    .click();

  await expect(page.getByRole("button", { name: "Salva" }))
    .toBeVisible();

  const savedNotice = page.getByRole("status")
    .filter({ hasText: "Salvo neste dispositivo." });

  await expect(savedNotice)
    .toBeVisible();

  await expect(savedNotice)
    .toBeHidden({ timeout: 5000 });

  await page.getByRole("button", { name: "Marcar como concluída" })
    .click();

  await expect(page.getByRole("button", { name: "Concluída" }))
    .toBeVisible();
});

test("a ação de prática da lição abre uma sessão de questões", async ({ page }) => {
  await page.goto("/licoes/1", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("link", { name: "Ir para a prática" })
    .click();

  await expect(page)
    .toHaveURL(/\/catalogo\?modo=praticar/);

  await expect(page.getByRole("heading", { name: "Praticar exercícios e questões" }))
    .toBeVisible();

  await page.getByRole("button", { name: "Começar sessão" })
    .click();

  await expect(page)
    .toHaveURL(/\/sessoes\/questoes\//);

  await validateRouteSettled(page);

  await expect(page.getByRole("button", { name: "Responder" }))
    .toBeVisible();
});

test("o estudante responde uma questão, salva e remove dos salvos e registra diagnóstico", async ({ page }) => {
  await page.goto("/questoes/1", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Salvar questão" })
    .click();

  await expect(page.getByRole("button", { name: "Remover dos salvos" }))
    .toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Remover dos salvos" })
    .click();

  await expect(page.getByRole("button", { name: "Salvar questão" }))
    .toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: /^C\) 11$/ })
    .click();

  await page.getByRole("button", { name: "Responder" })
    .click();

  const responseDialog = page.getByRole("dialog");

  await responseDialog.getByRole("button", { name: "Seguro" })
    .click();

  await responseDialog.getByRole("button", { name: "Enviar resposta" })
    .click();

  await expect(page.getByText("Resposta correta", { exact: true }))
    .toBeVisible();

  await expect(page.getByText("Resposta incorreta", { exact: true }))
    .toHaveCount(0);

  await page.getByRole("button", { name: "Avaliar tentativa" })
    .click();

  const diagnosisDialog = page.getByRole("dialog");

  await diagnosisDialog.getByRole("button", { name: "Acertei com segurança" })
    .click();

  await diagnosisDialog.getByRole("button", { name: "Salvar avaliação" })
    .click();

  await expect(page.getByRole("button", { name: "Alterar avaliação" }))
    .toBeVisible();
});

test("o desempenho mantém resumo e detalhes em páginas claras", async ({ page }) => {
  await page.goto("/desempenho", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("link", { name: "Ver filtros e detalhes" })
    .click();

  await expect(page)
    .toHaveURL(/\/desempenho\/detalhes$/);

  await expect(page.getByRole("heading", { name: "Detalhes do desempenho" }))
    .toBeVisible();

  await expect(page.getByText("Recorte das evidências", { exact: true }))
    .toBeVisible();

  await page.getByRole("link", { name: "Voltar ao resumo" })
    .click();

  await expect(page)
    .toHaveURL(/\/desempenho$/);
});

test("o catálogo inicia uma sessão de questões e a sessão chega a um estado terminal", async ({
  page,
}) => {
  await page.goto("/catalogo", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("tab", { name: /Conteúdos/ })
    .click();

  await page.getByRole("spinbutton", { name: "Quantidade" })
    .fill("1");

  await page.getByRole("button", { name: "Começar sessão" })
    .click();

  await expect(page)
    .toHaveURL(/\/sessoes\/questoes\//);

  await validateRouteSettled(page);

  await expect(page.locator("#main-content"))
    .toBeVisible();
});

test("o espaço pessoal cria nota, checklist, pendência e referência", async ({ page }) => {
  await page.goto("/meu-espaco", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByText("Nova nota", { exact: true })
    .click();

  await page.getByRole("textbox", { name: "Título da nota" })
    .fill("Nota de fluxo");

  await page.getByRole("textbox", { name: "Texto da nota" })
    .fill("Conteúdo da nota");

  await page.getByRole("button", { name: "Salvar nota" })
    .click();

  await page.getByText("Nova lista de estudo", { exact: true })
    .click();

  await page.getByRole("textbox", { name: "Título do checklist" })
    .fill("Checklist de fluxo");

  await page.getByRole("textbox", { name: "Itens, um por linha" })
    .fill("Primeiro item\nSegundo item");

  await page.getByRole("button", { name: "Salvar checklist" })
    .click();

  await page.getByText("Novo lembrete de estudo", { exact: true })
    .click();

  await page.getByRole("textbox", { name: "Título da pendência" })
    .fill("Pendência de fluxo");

  await page.getByRole("textbox", { name: "Descrição" })
    .fill("Descrição da pendência");

  await page.getByRole("button", { name: "Salvar pendência" })
    .click();

  await page.getByText("Nova referência", { exact: true })
    .click();

  await page.getByRole("textbox", { name: "Título da referência" })
    .fill("Referência de fluxo");

  await page.getByRole("textbox", { name: "Fonte ou endereço" })
    .fill("https://example.test");

  await page.getByRole("button", { name: "Salvar referência" })
    .click();

  await expect(page.getByText("Nota de fluxo", { exact: true })
    .last())
    .toBeVisible();

  await expect(page.getByText("Checklist de fluxo", { exact: true })
    .last())
    .toBeVisible();

  await expect(page.getByText("Pendência de fluxo", { exact: true })
    .last())
    .toBeVisible();

  await expect(page.getByText("Referência de fluxo", { exact: true })
    .last())
    .toBeVisible();
});

test("metas, foco, situação acadêmica, preferências e agenda executam seus fluxos", async ({
  page,
}) => {
  await page.goto("/metas", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByText("Nova meta", { exact: true })
    .click();

  await page.getByRole("textbox", { name: "Título" })
    .fill("Meta de fluxo");

  await page.getByRole("spinbutton", { name: "Quantidade alvo" })
    .fill("5");

  await page.getByRole("button", { name: "Criar meta" })
    .click();

  await expect(page.getByText("Meta de fluxo"))
    .toBeVisible();

  await page.goto("/foco", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("textbox", { name: "Conteúdo associado (opcional)" })
    .last()
    .fill("lesson:primeiro-conceito");

  await page.getByRole("button", { name: "Iniciar foco" })
    .click();

  await expect(page.getByRole("button", { name: "Pausar foco" }))
    .toBeEnabled();

  await page.getByRole("button", { name: "Pausar foco" })
    .click();

  await page.getByRole("button", { name: "Retomar foco" })
    .click();

  await page.getByRole("button", { name: "Encerrar foco" })
    .click();

  await page.goto("/academico", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  await page.getByRole("button", { name: "Nova disciplina" })
    .click();

  await page.locator("summary")
    .filter({ hasText: "Adicionar uma avaliação (opcional)" })
    .click();

  await page.getByRole("textbox", { name: "Nome", exact: true })
    .fill("Disciplina de fluxo");

  await page.getByRole("spinbutton", { name: "Aulas previstas" })
    .fill("10");

  await page.getByRole("spinbutton", { name: "Aulas presentes" })
    .fill("8");

  await page.getByRole("button", { name: "Salvar disciplina" })
    .click();

  await expect(page.getByText("Disciplina de fluxo"))
    .toBeVisible();

  await page.getByRole("button", { name: "Editar" })
    .click();

  await page.getByRole("textbox", { name: "Nome", exact: true })
    .fill("Disciplina editada");

  await page.getByRole("button", { name: "Salvar disciplina" })
    .click();

  await expect(page.getByText("Disciplina editada"))
    .toBeVisible();

  await page.goto("/preferencias", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const recommendations = page.getByRole("switch", { name: "Recomendações" });

  const initialRecommendations = await recommendations.isChecked();

  await recommendations.click();

  await expect(recommendations)
    .toBeChecked({ checked: !initialRecommendations });

  await page.getByRole("button", { name: "Nunca" })
    .click();

  await expect(page.getByRole("button", { name: "Nunca" }))
    .toHaveAttribute("aria-pressed", "true");

  await page.reload({ waitUntil: "networkidle" });

  await expect(page.getByRole("switch", { name: "Recomendações" }))
    .toBeChecked({ checked: !initialRecommendations });

  await expect(page.getByRole("button", { name: "Nunca" }))
    .toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Restaurar padrões" })
    .click();

  await page.goto("/agenda", { waitUntil: "networkidle" });

  await validateRouteSettled(page);

  const calendarReferenceDate = await page.getByRole("textbox", { name: "Data de referência" })
    .inputValue();

  await page.getByText("Adicionar compromisso", { exact: true })
    .click();

  await page.getByRole("textbox", { name: "Título", exact: true })
    .fill("Compromisso de fluxo");

  await page.getByRole("textbox", { name: "Início" })
    .fill(calendarReferenceDate);

  await page.getByRole("button", { name: "Adicionar à agenda" })
    .click();

  await expect(page.getByText("Compromisso de fluxo"))
    .toBeVisible();

  await page.getByRole("button", { name: "Editar" })
    .click();

  const calendarDialog = page.getByRole("dialog");

  await calendarDialog.getByRole("textbox", { name: "Título", exact: true })
    .fill("Compromisso editado");

  await calendarDialog.getByRole("button", { name: "Editar" })
    .click();

  await expect(page.getByText("Compromisso editado"))
    .toBeVisible();

  await page.getByRole("button", { name: "Excluir" })
    .click();

  await expect(page.getByText("Compromisso editado"))
    .toHaveCount(0);

  await page.getByRole("button", { name: "Semana" })
    .click();

  await page.getByRole("button", { name: "Mês" })
    .click();

  await page.getByRole("button", { name: "Dia" })
    .click();
});
