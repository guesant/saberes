import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./locales/pt-br.locale";

export const UI_LOCALE = "pt-BR";

i18n.use(initReactI18next).init({
  lng: UI_LOCALE,
  fallbackLng: UI_LOCALE,
  supportedLngs: [UI_LOCALE],
  resources: { [UI_LOCALE]: { translation: ptBR } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export { i18n };
