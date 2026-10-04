import "i18next";
import ptBR from "./locales/pt-br.locale";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof ptBR;
    };
    strictKeyChecks: true;
  }
}
