import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ContentLoadingState } from "./components/content-loading-state.component";
import { Shell } from "./components/shell.component";

const CatalogView = lazy(() =>
  import("./features/catalog/catalog-view.component").then(({ CatalogView: Component }) => ({
    default: Component,
  })),
);

const AssessmentView = lazy(() =>
  import("./features/assessments/assessment-view.component").then(
    ({ AssessmentView: Component }) => ({ default: Component }),
  ),
);

const MyStudyView = lazy(() =>
  import("./features/my-study/my-study-view.component").then(({ MyStudyView: Component }) => ({
    default: Component,
  })),
);

const PerformanceView = lazy(() =>
  import("./features/performance/performance-view.component").then(
    ({ PerformanceView: Component }) => ({ default: Component }),
  ),
);

const ReviewView = lazy(() =>
  import("./features/reviews/review-view.component").then(({ ReviewView: Component }) => ({
    default: Component,
  })),
);

const CourseView = lazy(() =>
  import("./features/courses/course-view.component").then(({ CourseView: Component }) => ({
    default: Component,
  })),
);

const LessonView = lazy(() =>
  import("./features/lessons/lesson-view.component").then(({ LessonView: Component }) => ({
    default: Component,
  })),
);

const QuestionView = lazy(() =>
  import("./features/exercises/question-view.component").then(({ QuestionView: Component }) => ({
    default: Component,
  })),
);

const QuestionStudySessionView = lazy(() =>
  import("./features/exercises/question-study-session-view.component").then(
    ({ QuestionStudySessionView: Component }) => ({ default: Component }),
  ),
);

const StudyPlanView = lazy(() =>
  import("./features/study-plans/study-plan-view.component").then(
    ({ StudyPlanView: Component }) => ({
      default: Component,
    }),
  ),
);

const TopicMapView = lazy(() =>
  import("./features/maps/topic-map-view.component").then(({ TopicMapView: Component }) => ({
    default: Component,
  })),
);

const TopicView = lazy(() =>
  import("./features/topics/topic-view.component").then(({ TopicView: Component }) => ({
    default: Component,
  })),
);

const GoalsView = lazy(() =>
  import("./features/goals/goals-view.component").then(({ GoalsView: Component }) => ({
    default: Component,
  })),
);

const FocusView = lazy(() =>
  import("./features/focus/focus-view.component").then(({ FocusView: Component }) => ({
    default: Component,
  })),
);

const AcademicView = lazy(() =>
  import("./features/academic/academic-view.component").then(({ AcademicView: Component }) => ({
    default: Component,
  })),
);

const PreferencesView = lazy(() =>
  import("./features/preferences/preferences-view.component").then(
    ({ PreferencesView: Component }) => ({ default: Component }),
  ),
);

const PersonalWorkspaceView = lazy(() =>
  import("./features/personal/personal-workspace-view.component").then(
    ({ PersonalWorkspaceView: Component }) => ({ default: Component }),
  ),
);

export function App() {
  return (
    <Shell>
      <Suspense fallback={<ContentLoadingState />}>
        <Routes>
          <Route element={<MyStudyView />} path="/" />

          <Route element={<CatalogView />} path="/catalogo" />

          <Route element={<MyStudyView />} path="/meu-estudo" />

          <Route element={<PerformanceView />} path="/desempenho" />

          <Route element={<ReviewView />} path="/revisoes" />

          <Route element={<CourseView />} path="/cursos/:slug" />

          <Route element={<StudyPlanView />} path="/plano/:slug" />

          <Route element={<TopicMapView />} path="/mapa/:slug" />

          <Route element={<TopicView />} path="/topicos/:slug" />

          <Route element={<GoalsView />} path="/metas" />

          <Route element={<FocusView />} path="/foco" />

          <Route element={<AcademicView />} path="/academico" />

          <Route element={<PreferencesView />} path="/preferencias" />

          <Route element={<PersonalWorkspaceView />} path="/meu-espaco" />

          <Route element={<LessonView />} path="/licoes/:lessonId" />

          <Route element={<QuestionView />} path="/questoes/:questionId" />

          <Route element={<QuestionStudySessionView />} path="/sessoes/questoes/:sessionId" />

          <Route element={<AssessmentView />} path="/avaliacoes/:assessmentId" />

          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
    </Shell>
  );
}
