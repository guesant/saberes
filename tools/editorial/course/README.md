# Roteiro local Unicamp 2027

Pacote-base: `content/editorial/unicamp-2027/lessons.json`; revisões versionadas por seção: `content/editorial/unicamp-2027/lesson-revisions.json`. O importador aplica os adendos sem alterar o arquivo-base e registra os hashes de ambos no relatório. As lições são microaulas editoriais originais e só contam como aprovadas quando o estado individual é `published`; ampliação em `review` continua visível para consulta, mas não é promovida silenciosamente. Prática usa somente ocorrências publicadas, gabaritos definitivos gradáveis e classificações aprovadas. Questões equivalentes são tratadas como uma família, sem criar novas questões.

```sh
python3 tools/editorial/course/import_study_path.py
python3 tools/editorial/course/import_study_path.py --apply --report .local/content/staging/unicamp-2027-v1/guided-study-path-2026-10-09.json
python3 tools/editorial/course/release_local.py --version unicamp-2027-guided-study-v1 --apply
```

Sem `--apply`, os comandos não alteram o banco. Aplicação preserva IDs existentes, faz backup e usa transações. O release verifica hashes e integridade; o build Vite copia o banco principal para `dist/data`. Não faz deploy.

`repair_gradable_keys.py` corrige exclusivamente flags técnicas de gabaritos definitivos já aprovados; não modifica respostas nem aprova conteúdo. Consulte o relatório antes de aplicar.

Triagem de PDFs: `tools/editorial/pdf/README.md`. Calibrar antes do lote, preservar fórmulas e revisar somente exceções identificadas. Planejamento de aliases em `tools/editorial/canonical` é diagnóstico: não aplicar enquanto leitores históricos dependerem dos registros existentes.

Revisão editorial: `tools/editorial/apply_review_decisions.py` aplica decisões individuais com estado anterior, justificativa e evidência. O dry-run simula as alterações em memória, incluindo constraints reais; a aplicação preserva IDs, faz backup e grava um journal. Não é um mecanismo de aprovação automática. Os planos e resultados ficam em `tools/editorial/review-closure`; `review_inventory.py` enumera os estados ainda abertos em todo o banco sem ocultar os históricos.
