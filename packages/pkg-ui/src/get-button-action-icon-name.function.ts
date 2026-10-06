export type UIButtonActionIconName =
  | "add"
  | "all"
  | "anchor"
  | "archive"
  | "backlink"
  | "arrowBack"
  | "arrowForward"
  | "bookmark"
  | "check"
  | "checklist"
  | "close"
  | "dependsOn"
  | "delete"
  | "download"
  | "edit"
  | "filter"
  | "help"
  | "link"
  | "materials"
  | "more"
  | "note"
  | "reference"
  | "reminder"
  | "pause"
  | "play"
  | "refresh"
  | "save"
  | "search"
  | "settings"
  | "supports"
  | "reviewAgain"
  | "reviewHard"
  | "reviewGood"
  | "reviewEasy"
  | "question"
  | "queue"
  | "snooze"
  | "suspend"
  | "action"
  | "known"
  | "uncertain"
  | "unknown"
  | "topic"
  | "upload";

const actionIconMatchers: Array<[RegExp, UIButtonActionIconName]> = [
  [/novamente|tentar de novo/iu, "reviewAgain"],
  [/difícil/iu, "reviewHard"],
  [/\bbom\b/iu, "reviewGood"],
  [/fácil/iu, "reviewEasy"],
  [/ver fila|fila de revisão/iu, "queue"],
  [/adiar/iu, "snooze"],
  [/suspender/iu, "suspend"],
  [/começar revisão|iniciar revisão|revisar agora/iu, "refresh"],
  [/^revisar$|revisar questão|abrir questão|praticar questões/iu, "question"],
  [/já conheço/iu, "known"],
  [/tenho dúvida/iu, "uncertain"],
  [/ainda não conheço/iu, "unknown"],
  [/salv.*quest|quest.*salv|bookmark|favorit/iu, "bookmark"],
  [/^praticar$|questões/iu, "question"],
  [/depende de/iu, "dependsOn"],
  [/âncora/iu, "anchor"],
  [/backlink|ver conexões/iu, "backlink"],
  [/apoia/iu, "supports"],
  [/conectar registros|relaç(?:ão|ões)/iu, "link"],
  [/nota/iu, "note"],
  [/lista|checklist/iu, "checklist"],
  [/lembrete|pendência/iu, "reminder"],
  [/referência/iu, "reference"],
  [/ajustar meta/iu, "settings"],
  [/tópico/iu, "topic"],
  [/materiais/iu, "materials"],
  [/todas|todos/iu, "all"],
  [/criar|adicionar|nova|novo|incluir/iu, "add"],
  [/editar|alterar|renomear/iu, "edit"],
  [/excluir|apagar|remover|deletar/iu, "delete"],
  [/arquivar/iu, "archive"],
  [/restaurar|desfazer/iu, "refresh"],
  [/exportar|baixar|download/iu, "download"],
  [/importar|enviar|upload/iu, "upload"],
  [/pausar/iu, "pause"],
  [/iniciar foco|começar foco|retomar foco/iu, "play"],
  [/continuar|abrir/iu, "arrowForward"],
  [/responder|verificar|concluir|finalizar|confirmar|pronto|feito/iu, "check"],
  [/salvar|guardar/iu, "save"],
  [/voltar|anterior|previous/iu, "arrowBack"],
  [/próxima|próximo|avançar|next/iu, "arrowForward"],
  [/fechar|cancelar|dispensar/iu, "close"],
  [/buscar|pesquisar/iu, "search"],
  [/filtro|filtrar/iu, "filter"],
  [/atualizar|tentar novamente|repetir|recarregar/iu, "refresh"],
  [/opções|mais/iu, "more"],
  [/preferências|configurações/iu, "settings"],
  [/ajuda|saiba mais/iu, "help"],
  [/play/iu, "play"],
];

export function getButtonActionIconName(label: string): UIButtonActionIconName {
  const match = actionIconMatchers.find(([pattern]) => {
    return pattern.test(label);
  });

  return match?.[1] ?? "action";
}
