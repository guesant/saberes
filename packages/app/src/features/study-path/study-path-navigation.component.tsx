import { UIBox, UIContentGroup, UIFormAction, UITypography } from "@guesant/saberes-ui";
import { StudyPathNextAction } from "./study-path-next-action.component";
import { StudyPathPreviousAction } from "./study-path-previous-action.component";
import { useStudyPathNavigation } from "./use-study-path-navigation.hook";

export function StudyPathNavigation() {
  const navigation = useStudyPathNavigation();

  if (!navigation) {
    return null;
  }

  return (
    <UIBox component="nav" aria-label="Navegação do roteiro de estudo">
      <UIContentGroup variant="section">
        <UITypography variant="body2">
          Passo {navigation.position} de {navigation.total}: {navigation.title}
        </UITypography>
        <UIFormAction href={navigation.roadmap}>Ver todo o roteiro</UIFormAction>
        <StudyPathPreviousAction href={navigation.previous} />
        <StudyPathNextAction href={navigation.next} />
        <UITypography variant="body2">
          Você pode seguir outra ordem. Navegar não marca uma atividade como concluída.
        </UITypography>
      </UIContentGroup>
    </UIBox>
  );
}
