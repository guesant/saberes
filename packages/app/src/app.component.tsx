import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ContentLoadingState } from "./components/content-loading-state.component";
import { Shell } from "./components/shell.component";
import {
  AcademicView,
  AssessmentDiscoveryView,
  AssessmentView,
  CalendarView,
  CatalogView,
  CourseView,
  FocusView,
  GoalsView,
  LessonView,
  MyStudyView,
  PerformanceView,
  PersonalWorkspaceView,
  PreferencesView,
  QuestionStudySessionView,
  QuestionView,
  ReviewView,
  StudyPlanView,
  TopicMapView,
  TopicView,
} from "./lazy-views.config";

export function App() {
  return (
    <Shell>
      <Suspense fallback={<ContentLoadingState />}>
        <Routes>
          <Route element={<MyStudyView />} path="/" />

          <Route element={<CatalogView />} path="/catalogo" />

          <Route element={<AssessmentDiscoveryView />} path="/provas" />

          <Route element={<MyStudyView />} path="/meu-estudo" />

          <Route element={<PerformanceView />} path="/desempenho" />

          <Route element={<PerformanceView />} path="/desempenho/detalhes" />

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

          <Route element={<CalendarView />} path="/agenda" />

          <Route element={<LessonView />} path="/licoes/:lessonId" />

          <Route element={<QuestionView />} path="/questoes/:questionId" />

          <Route element={<QuestionView />} path="/exercicios/:exerciseSlug" />

          <Route element={<QuestionStudySessionView />} path="/sessoes/questoes/:sessionId" />

          <Route element={<AssessmentView />} path="/avaliacoes/:assessmentId" />

          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
    </Shell>
  );
}
