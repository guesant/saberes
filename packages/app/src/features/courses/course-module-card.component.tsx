import { UICard, UICardContent, UIContentGroup, UIList } from "@guesant/saberes-ui";
import { CourseItemRow } from "./course-item-row.component";
import { CourseRoadmapModuleHeader } from "./course-roadmap-module-header.component";

export type CourseModuleCardProps = {
  module: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
};

export function CourseModuleCard(props: CourseModuleCardProps) {
  const { module, items } = props;

  const moduleItems = items.filter((item) => {
    return item.module_id === module.id;
  });

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <CourseRoadmapModuleHeader module={module} />

          <UIList>
            {moduleItems.map((item) => {
              return <CourseItemRow key={String(item.id)} item={item} />;
            })}
          </UIList>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
