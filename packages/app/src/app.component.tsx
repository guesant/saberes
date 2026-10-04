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

export function App() {
  return (
    <Shell>
      <Suspense fallback={<ContentLoadingState />}>
        <Routes>
          <Route element={<MyStudyView />} path="/" />

          <Route element={<CatalogView />} path="/catalogo" />

          <Route element={<MyStudyView />} path="/meu-estudo" />

          <Route element={<ReviewView />} path="/revisoes" />

          <Route element={<CourseView />} path="/cursos/:slug" />

          <Route element={<StudyPlanView />} path="/plano/:slug" />

          <Route element={<TopicMapView />} path="/mapa/:slug" />

          <Route element={<TopicView />} path="/topicos/:slug" />

          <Route element={<LessonView />} path="/licoes/:lessonId" />

          <Route element={<QuestionView />} path="/questoes/:questionId" />

          <Route element={<AssessmentView />} path="/avaliacoes/:assessmentId" />

          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
    </Shell>
  );
}
