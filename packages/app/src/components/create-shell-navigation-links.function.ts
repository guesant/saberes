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
import { createIconElement } from "./create-icon-element.function";
import type { NavigationLink } from "./navigation-link.interface";
import type { ShellTranslator } from "./shell-translator.type";

export function createShellNavigationLinks(translate: ShellTranslator): NavigationLink[] {
  return [
    { icon: createIconElement(UIExploreIcon), label: translate("common.catalog"), to: "/catalogo" },
    { icon: createIconElement(UIEventNoteIcon), label: translate("nav.calendar"), to: "/agenda" },
    { icon: createIconElement(UIRefreshIcon), label: translate("common.review"), to: "/revisoes" },
    {
      icon: createIconElement(UIAutoStoriesIcon),
      label: translate("common.myStudy"),
      to: "/meu-estudo",
    },
    {
      icon: createIconElement(UIEventNoteIcon),
      label: translate("nav.performance"),
      to: "/desempenho",
    },
    { icon: createIconElement(UIPlayArrowIcon), label: translate("nav.goals"), to: "/metas" },
    { icon: createIconElement(UIOfflineBoltIcon), label: translate("nav.focus"), to: "/foco" },
    { icon: createIconElement(UIQuizIcon), label: translate("nav.academic"), to: "/academico" },
    {
      icon: createIconElement(UICheckCircleIcon),
      label: translate("nav.preferences"),
      to: "/preferencias",
    },
    {
      icon: createIconElement(UIBookmarkBorderIcon),
      label: translate("nav.personal"),
      to: "/meu-espaco",
    },
  ];
}
