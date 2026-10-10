import { useLocation, useSearchParams } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { useCourseContentQuery } from "../courses/use-course-content-query.hook";
import { getStudyPathNavigation } from "./get-study-path-navigation.function";

export function useStudyPathNavigation() {
  const services = useAppServices();

  const [params] = useSearchParams();

  const location = useLocation();

  const slug = params.get("course") || undefined;

  const query = useCourseContentQuery({ services, slug });

  if (!slug || !query.data) {
    return null;
  }

  return getStudyPathNavigation(query.data.items, slug, {
    stepId: params.get("step"),
    pathname: location.pathname,
  });
}
