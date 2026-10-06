export type UIButtonActionIconName =
  | "add"
  | "archive"
  | "arrowBack"
  | "arrowForward"
  | "bookmark"
  | "check"
  | "close"
  | "delete"
  | "download"
  | "edit"
  | "filter"
  | "help"
  | "more"
  | "pause"
  | "play"
  | "refresh"
  | "save"
  | "search"
  | "settings"
  | "upload";

const actionIconMatchers: Array<[RegExp, UIButtonActionIconName]> = [
  [/salv.*quest|quest.*salv|bookmark|favorit/iu, "bookmark"],
  [/criar|adicionar|nova|novo|incluir/iu, "add"],
  [/editar|alterar|renomear/iu, "edit"],
  [/excluir|apagar|remover|deletar/iu, "delete"],
  [/arquivar/iu, "archive"],
  [/restaurar|desfazer/iu, "refresh"],
  [/exportar|baixar|download/iu, "download"],
  [/importar|enviar|upload/iu, "upload"],
  [/pausar/iu, "pause"],
  [/retomar|iniciar|começar|comece|praticar/iu, "play"],
  [/continuar|abrir/iu, "arrowForward"],
  [/responder|verificar|concluir|finalizar|confirmar|pronto|feito/iu, "check"],
  [/salvar|guardar/iu, "save"],
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
  const match = actionIconMatchers.find(([pattern]) => {return pattern.test(label);});

  return match?.[1] ?? "arrowForward";
}
