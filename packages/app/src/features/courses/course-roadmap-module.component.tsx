import { UIContentGroup } from "@guesant/saberes-ui";
import { CourseRoadmapModuleHeader } from "./course-roadmap-module-header.component";
import { CourseRoadmapModuleStep } from "./course-roadmap-module-step.component";
import type { CourseModulesProps } from "./course-modules.component";

export interface CourseRoadmapModuleProps extends CourseModulesProps {
  module: Record<string, unknown>;
  firstStepNumber: number;
  currentItem: Record<string, unknown> | undefined;
}

export function CourseRoadmapModule(props: CourseRoadmapModuleProps) {
  const moduleItems = props.items.filter((item) => {return item.module_id === props.module.id;});

  return (
    <UIContentGroup variant="content">
      <CourseRoadmapModuleHeader module={props.module} />
      {moduleItems.map((item, index) => {
        return (
          <CourseRoadmapModuleStep
            key={String(item.id)}
            context={props}
            current={props.currentItem === item}
            item={item}
            stepNumber={props.firstStepNumber + index}
          />
        );
      })}
    </UIContentGroup>
  );
}
