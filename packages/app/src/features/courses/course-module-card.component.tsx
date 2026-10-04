import { UICard, UICardContent, UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { CourseItemRow } from "./course-item-row.component";

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
        <UIContentGroup variant="tight">
          <UITypography variant="h6">
            {String(module.position)}.{String(module.title)}
          </UITypography>

          <UITypography variant="body2" color="text.secondary">
            {String(module.description || "")}
          </UITypography>
        </UIContentGroup>

        <UIList>
          {moduleItems.map((item) => {
            return <CourseItemRow key={String(item.id)} item={item} />;
          })}
        </UIList>
      </UICardContent>
    </UICard>
  );
}
