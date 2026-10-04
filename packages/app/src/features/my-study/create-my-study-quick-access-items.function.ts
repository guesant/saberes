import {
  UIAutoStoriesIcon,
  UIBookmarkBorderIcon,
  UICheckCircleIcon,
  UIEventNoteIcon,
  UIExploreIcon,
  UIOfflineBoltIcon,
  UIPlayArrowIcon,
  UIQuizIcon,
  UIRefreshIcon,
} from "@guesant/saberes-ui";
import { createIconElement } from "../../components/create-icon-element.function";
import type { MyStudyQuickAccessCardProps } from "./my-study-quick-access-card-props.interface";
import type { ShellTranslator } from "../../components/shell-translator.type";

const quickAccessDefinitions = [
  { icon: UIAutoStoriesIcon, titleKey: "nav.myStudy", to: "/meu-estudo" },
  { icon: UIExploreIcon, titleKey: "nav.catalog", to: "/catalogo" },
  { icon: UIRefreshIcon, titleKey: "nav.review", to: "/revisoes" },
  { icon: UIEventNoteIcon, titleKey: "nav.performance", to: "/desempenho" },
  { icon: UIPlayArrowIcon, titleKey: "nav.goals", to: "/metas" },
  { icon: UIOfflineBoltIcon, titleKey: "nav.focus", to: "/foco" },
  { icon: UIQuizIcon, titleKey: "nav.academic", to: "/academico" },
  { icon: UICheckCircleIcon, titleKey: "nav.preferences", to: "/preferencias" },
  { icon: UIBookmarkBorderIcon, titleKey: "nav.personal", to: "/meu-espaco" },
];

export function createMyStudyQuickAccessItems(
  translate: ShellTranslator,
): MyStudyQuickAccessCardProps[] {
  const description = translate("home.quickAccess.openDescription");

  return quickAccessDefinitions.map((definition) => {
    return {
      description,
      icon: createIconElement(definition.icon),
      title: translate(definition.titleKey),
      to: definition.to,
    };
  });
}
