import { UIContentGroup } from "@guesant/saberes-ui";
import { CourseModuleCard } from "./course-module-card.component";

export type CourseModulesProps = {
  modules: Array<Record<string, unknown>>;
  items: Array<Record<string, unknown>>;
};

export function CourseModules(props: CourseModulesProps) {
  return (
    <UIContentGroup variant="content">
      {props.modules.map((module) => {
        return <CourseModuleCard key={String(module.id)} module={module} items={props.items} />;
      })}
    </UIContentGroup>
  );
}
