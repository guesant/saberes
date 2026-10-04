import "i18next";
import ptBR from "./locales/pt-br.locale";

type I18nextResources = {
  translation: typeof ptBR;
};

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: I18nextResources;
    strictKeyChecks: true;
  }
}
