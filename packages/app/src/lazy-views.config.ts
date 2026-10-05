import { lazy } from "react";

export const CatalogView = lazy(() => {
  return import("./features/catalog/catalog-view.component").then(({ CatalogView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const AssessmentView = lazy(() => {
  return import("./features/assessments/assessment-view.component").then(
    ({ AssessmentView: Component }) => {
      return { default: Component };
    },
  );
});

export const MyStudyView = lazy(() => {
  return import("./features/my-study/my-study-view.component").then(
    ({ MyStudyView: Component }) => {
      return {
        default: Component,
      };
    },
  );
});

export const PerformanceView = lazy(() => {
  return import("./features/performance/performance-view.component").then(
    ({ PerformanceView: Component }) => {
      return { default: Component };
    },
  );
});

export const ReviewView = lazy(() => {
  return import("./features/reviews/review-view.component").then(({ ReviewView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const CourseView = lazy(() => {
  return import("./features/courses/course-view.component").then(({ CourseView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const LessonView = lazy(() => {
  return import("./features/lessons/lesson-view.component").then(({ LessonView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const QuestionView = lazy(() => {
  return import("./features/exercises/question-view.component").then(
    ({ QuestionView: Component }) => {
      return {
        default: Component,
      };
    },
  );
});

export const QuestionStudySessionView = lazy(() => {
  return import("./features/exercises/question-study-session-view.component").then(
    ({ QuestionStudySessionView: Component }) => {
      return { default: Component };
    },
  );
});

export const StudyPlanView = lazy(() => {
  return import("./features/study-plans/study-plan-view.component").then(
    ({ StudyPlanView: Component }) => {
      return {
        default: Component,
      };
    },
  );
});

export const TopicMapView = lazy(() => {
  return import("./features/maps/topic-map-view.component").then(({ TopicMapView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const TopicView = lazy(() => {
  return import("./features/topics/topic-view.component").then(({ TopicView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const GoalsView = lazy(() => {
  return import("./features/goals/goals-view.component").then(({ GoalsView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const FocusView = lazy(() => {
  return import("./features/focus/focus-view.component").then(({ FocusView: Component }) => {
    return {
      default: Component,
    };
  });
});

export const AcademicView = lazy(() => {
  return import("./features/academic/academic-view.component").then(
    ({ AcademicView: Component }) => {
      return {
        default: Component,
      };
    },
  );
});

export const PreferencesView = lazy(() => {
  return import("./features/preferences/preferences-view.component").then(
    ({ PreferencesView: Component }) => {
      return { default: Component };
    },
  );
});

export const PersonalWorkspaceView = lazy(() => {
  return import("./features/personal/personal-workspace-view.component").then(
    ({ PersonalWorkspaceView: Component }) => {
      return { default: Component };
    },
  );
});

export const CalendarView = lazy(() => {
  return import("./features/calendar/calendar-view.component").then(({ CalendarView: Component }) => {
    return { default: Component };
  });
});
