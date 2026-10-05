import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalArchivedItem } from "./personal-archived-item.component";
import type { PersonalArchivedListItem } from "./personal-archived-list-item.interface";

export interface PersonalArchivedListProps {
  items: PersonalArchivedListItem[];
  title: string;
  onRestore(id: string): Promise<void>;
}

export function PersonalArchivedList(props: PersonalArchivedListProps) {
  return (
    <UIContentGroup variant="content">
      <UITypography variant="h6">{props.title}</UITypography>
      {props.items.map((item) => {
        return (
          <PersonalArchivedItem
            key={item.id}
            onRestore={() => {
              return props.onRestore(item.id);
            }}
            title={item.title}
          />
        );
      })}
    </UIContentGroup>
  );
}
