import { Box, Card, CardContent, Typography } from "@guesant/saberes-ui";
import { CourseItemRow } from "./course-item-row.component";

export type CourseModuleCardProps = {
  module: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
};

export function CourseModuleCard(props: CourseModuleCardProps) {
  const { module, items } = props;

  const moduleItems = items.filter((item) => item.module_id === module.id);

  return (
    <Card>
      <CardContent>
        <Box>
          <Typography variant="h6">
            {String(module.position)}.{String(module.title)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {String(module.description || "")}
          </Typography>
        </Box>

        {moduleItems.map((item) => (
          <CourseItemRow key={String(item.id)} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
