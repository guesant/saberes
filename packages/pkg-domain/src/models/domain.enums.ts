export enum UniversityCode {
  Unicamp = "unicamp",
  Usp = "usp",
}

export enum AdmissionProcessCode {
  Enem = "enem",
  Unicamp = "unicamp",
  Fuvest = "fuvest",
}

export enum OrganizerCode {
  Comvest = "comvest",
  Fuvest = "fuvest",
  Inep = "inep",
}

export enum OrganizerType {
  ExamBoard = "exam_board",
  Government = "government",
}

export enum AdmissionProcessKind {
  Vestibular = "vestibular",
  NationalExam = "national_exam",
}

export enum StageKind {
  Objective = "objective",
  Discursive = "discursive",
  Essay = "essay",
}

export enum PaperKind {
  Objective = "objective",
  Discursive = "discursive",
  Essay = "essay",
}

export enum QuestionType {
  SingleChoice = "single_choice",
  MultipleChoice = "multiple_choice",
  TrueFalse = "true_false",
  Numeric = "numeric",
  ShortText = "short_text",
  Discursive = "discursive",
  Essay = "essay",
  Matching = "matching",
  Ordering = "ordering",
}

export enum QuestionStatus {
  Draft = "draft",
  Review = "review",
  Published = "published",
}

export enum Difficulty {
  Basic = "basic",
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
  Advanced = "advanced",
  All = "all",
}

export enum CatalogCardType {
  Course = "course",
  Map = "map",
  Plan = "plan",
  Lesson = "lesson",
  Resource = "resource",
  Question = "question",
}

export enum LearningCourseType {
  General = "general",
  Specific = "specific",
}

export enum LearningDomain {
  ExamPrep = "exam_prep",
  Pedagogy = "pedagogy",
}

export enum AssessmentSetKind {
  Simulator = "simulator",
  QuestionSet = "question_set",
  Exam = "exam",
  Essay = "essay",
  Challenge = "challenge",
}

export enum AssessmentItemType {
  Question = "question",
  Lesson = "lesson",
  Review = "review",
}

export enum LearningCourseItemType {
  Lesson = "lesson",
  Theory = "theory",
  Example = "example",
  Practice = "practice",
  QuestionSet = "question_set",
  Review = "review",
  Assessment = "assessment",
}

export enum LessonSectionType {
  Theory = "theory",
  Example = "example",
  Practice = "practice",
  Review = "review",
}

export enum PedagogicalRole {
  Context = "context",
  Analogy = "analogy",
  Intuition = "intuition",
  Formalization = "formalization",
  Limitation = "limitation",
  Example = "example",
  GuidedPractice = "guided_practice",
  IndependentPractice = "independent_practice",
  Application = "application",
  Review = "review",
}

export enum ContentFormat {
  Markdown = "markdown",
  PlainText = "plain_text",
}

export enum ReviewStatus {
  Draft = "draft",
  Review = "review",
  Published = "published",
}

export enum TopicRelationType {
  Parent = "parent",
  Similar = "similar",
  Prerequisite = "prerequisite",
  Related = "related",
}

export enum QuestionTopicRelationType {
  Primary = "primary",
  Secondary = "secondary",
}

export enum ReviewTargetType {
  Concept = "concept",
  Question = "question",
  Lesson = "lesson",
}

export enum LearningState {
  Unseen = "unseen",
  Learning = "learning",
  Practicing = "practicing",
  Mastered = "mastered",
}

export enum ReviewState {
  New = "new",
  Learning = "learning",
  Review = "review",
  Relearning = "relearning",
}

export enum DiagnosisCode {
  ConceptGap = "concept_gap",
  DidNotKnow = "did_not_know",
  ProceduralGap = "procedural_gap",
  InterpretationGap = "interpretation_gap",
  StrategyGap = "strategy_gap",
  Inattention = "inattention",
  Forgetting = "forgetting",
  CorrectWithDoubt = "correct_with_doubt",
  CorrectByGuess = "correct_by_guess",
  CorrectConfident = "correct_confident",
}

export enum DiagnosisConfidence {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum AttemptConfidence {
  Confident = "confident",
  Doubt = "doubt",
  Guess = "guess",
}

export enum PriorKnowledgeStatus {
  Known = "known",
  Uncertain = "uncertain",
  Unknown = "unknown",
}

export enum DiagnosisSource {
  Heuristic = "heuristic",
  Student = "student",
}

export enum PedagogicalAction {
  Theory = "theory",
  Practice = "practice",
  Review = "review",
  Retry = "retry",
  None = "none",
}

export enum FsrsRating {
  Again = "again",
  Hard = "hard",
  Good = "good",
  Easy = "easy",
}
