import { Stack } from "@guesant/saberes-ui";
import { CourseModuleCard } from "./course-module-card.component";

export type CourseModulesProps = {
  modules: Array<Record<string, unknown>>;
  items: Array<Record<string, unknown>>;
};

export function CourseModules(props: CourseModulesProps) {
  return (
    <Stack spacing={2}>
      {props.modules.map((module) => (
        <CourseModuleCard key={String(module.id)} module={module} items={props.items} />
      ))}
    </Stack>
  );
}
