import { UIQuickAccessGrid } from "@guesant/saberes-ui";
import { MyStudyQuickAccessCard } from "./my-study-quick-access-card.component";
import type { MyStudyQuickAccessItemsProps } from "./my-study-quick-access-items-props.interface";

export function MyStudyQuickAccessItems(props: MyStudyQuickAccessItemsProps) {
  return (
    <UIQuickAccessGrid>
      {props.items.map((item) => {
        return (
          <MyStudyQuickAccessCard
            description={item.description}
            icon={item.icon}
            key={item.to}
            title={item.title}
            to={item.to}
          />
        );
      })}
    </UIQuickAccessGrid>
  );
}
