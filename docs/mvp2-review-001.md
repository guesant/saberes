# M2-REVIEW-001 — demonstração local do Skate

## Escopo

Esta revisão verifica se uma pessoa consegue iniciar o primeiro estudo sem depender de rede, conta ou serviço externo. O conteúdo disponível é tratado como fonte local; o progresso de início do Curso é salvo localmente e a navegação entre telas ocorre dentro da PWA.

## Roteiro executado

1. Abrir a rota inicial e aguardar o shell e o conteúdo local.
2. Abrir `Catálogo` pela navegação principal.
3. Abrir o primeiro Curso disponível no catálogo, sem depender de slug fixo.
4. Acionar `Começar curso` e confirmar a transição local para `Continuar curso`.
5. Cortar a rede do contexto do navegador.
6. Voltar para `Meu estudo` e confirmar a Home de estudo.
7. Voltar para `Catálogo` e confirmar que a lista continua disponível.

## Evidência automatizada

- Teste: `packages/app/tests/e2e/mvp2-review-001.spec.ts`.
- Comando: `mvp2:review:check`.
- Ambiente: imagem Playwright do projeto, com `PLAYWRIGHT_BASE_URL=http://web`.
- Política de rede: somente a origem local foi permitida; origens externas foram bloqueadas.
- Após o boot, o contexto foi colocado em modo offline antes da navegação entre `Meu estudo` e `Catálogo`.
- Resultado: `1 passed`.

## Linguagem observada

| Termo canônico | Uso observado                                                    | Não representa                    |
| -------------- | ---------------------------------------------------------------- | --------------------------------- |
| Pessoa         | proprietária do estudo e dos dados locais                        | usuário remoto ou membro de grupo |
| Catálogo       | entrada para encontrar Curso, mapa, plano ou conteúdo disponível | fonte externa ou busca remota     |
| Curso          | conjunto local de módulos e itens estudáveis                     | conta, turma ou comunidade        |
| Meu estudo     | Home que projeta progresso e próximos passos                     | banco separado do progresso       |
| Sessão         | ciclo de estudo retomável                                        | conexão de rede                   |
| Progresso      | evidência local gerada por ações de estudo                       | garantia de domínio absoluto      |

`Primeiro estudo` permanece uma descrição do roteiro sintético e não cria um novo conceito de domínio.

## Atritos encontrados

- O primeiro roteiro de teste usava um slug sintético fixo, mas o catálogo pode expor Cursos locais com identificadores diferentes. O teste foi ajustado para abrir o primeiro link de Curso disponível.
- A rota `/meu-estudo` apresenta a Home de estudo com o título `Estude com método.`; `Meu espaço local` pertence à área pessoal. A distinção foi registrada para evitar que o texto de uma tela seja usado como sinônimo de outra entidade.
- A ação de Curso confirma o estado persistido pela troca de `Começar curso` para `Continuar curso`; não foi necessário introduzir uma tela de confirmação separada.

## Decisões

- O primeiro roteiro deve selecionar entidades pelo catálogo local e por contratos de navegação, sem depender de fixtures, títulos ou slugs específicos.
- A demonstração de offline deve bloquear rede depois do boot e validar navegação local, não apenas verificar a presença de um rótulo “Offline”.
- `Curso`, `Meu estudo`, `Sessão` e `Progresso` permanecem termos distintos; a UI pode apresentar descrições, mas não cria sinônimos de domínio.
- A ação de iniciar Curso continua um comando local idempotente; a próxima versão pode acrescentar retomada e captura sem alterar esse contrato.

## Tarefas do Patinete

- Observar três cenários de captura rápida: ideia, compromisso e lembrete acadêmico.
- Fechar o vocabulário de `Captura`, `Inbox`, `Atividade`, `Evento`, `Lembrete`, `Adiado`, `Arquivado` e `Recorrência simples` antes de criar telas.
- Modelar a conversão de uma Captura em Nota ou Atividade sem cópia concorrente.
- Preservar a estratégia de seleção por identificador local e o tratamento de estados vazio, erro, offline e retomada.

## Limites

Esta revisão não adiciona sincronização, calendário externo, colaboração, plugins, IA, OCR, processamento pesado ou conteúdo editorial. Essas capacidades permanecem fora dos MVPs locais conforme o backlog.
