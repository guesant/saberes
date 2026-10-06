import { useEffect } from "react";
import { registerTopicSectionScroll } from "./register-topic-section-scroll.function";

type TopicSectionIndexSetter = (index: number) => void;

export function useSyncTopicSectionScroll(setActiveSection: TopicSectionIndexSetter): void {
  useEffect(() => {return registerTopicSectionScroll(setActiveSection);}, [setActiveSection]);
}
