import initSqlJs from "sql.js";
import { join } from "@std/path";

const root = Deno.cwd();
const file = Deno.env.get("CONTENT_DB") || join(root, ".local/content/content.sqlite");
const required = [
    "universities",
    "organizers",
    "admission_processes",
    "editions",
    "stages",
    "papers",
    "paper_versions",
    "subjects",
    "assessment_areas",
    "paper_subjects",
    "questions",
    "question_occurrences",
    "question_options",
    "question_parts",
    "answer_keys",
    "curricula",
    "topics",
    "topic_subjects",
    "curriculum_topics",
    "topic_relations",
    "question_topics",
    "lessons",
    "lesson_sections",
    "lesson_sources",
    "resources",
    "resource_topics",
    "assessment_sets",
    "assessment_set_items",
    "degree_programs",
    "course_offerings",
    "learning_courses",
    "learning_course_modules",
    "learning_course_items",
    "learning_course_topics",
    "learning_course_targets",
    "learning_maps",
    "learning_map_topics",
    "learning_map_edges",
    "study_plans",
    "study_plan_steps",
    "question_relations",
    "scoring_rules",
    "content_releases",
];
const SQL = await initSqlJs({
    locateFile: (name) => join(root, "node_modules/sql.js/dist", name),
});
const db = new SQL.Database(Deno.readFileSync(file));
const tables =
    db.exec("SELECT name FROM sqlite_master WHERE type = 'table'")[0]?.values.flat() || [];
const missing = required.filter((table) => !tables.includes(table));
if (missing.length) throw new Error(`Tabelas ausentes: ${missing.join(", ")}`);
const count = db.exec("SELECT COUNT(*) FROM questions")[0].values[0][0];
const processes =
    db.exec("SELECT COUNT(*) FROM admission_processes WHERE is_published = 1")[0]?.values[0]?.[0] ||
    0;
if (!count) throw new Error("O snapshot não contém questões.");
if (!processes) throw new Error("O snapshot não contém processos publicados.");
const orphanOccurrences = db.exec(
    "SELECT COUNT(*) FROM question_occurrences qo LEFT JOIN papers p ON p.id = qo.paper_id WHERE p.id IS NULL",
)[0].values[0][0];
if (orphanOccurrences) throw new Error("Existem ocorrências de questões sem prova.");
const missingOccurrenceKeys = db.exec(
    "SELECT COUNT(*) FROM question_occurrences WHERE occurrence_key IS NULL OR occurrence_key = ''",
)[0].values[0][0];
if (missingOccurrenceKeys) throw new Error("Existem ocorrências de questões sem chave estável.");
const orphanCourseItems = db.exec(
    "SELECT COUNT(*) FROM learning_course_items i LEFT JOIN learning_course_modules m ON m.id = i.module_id WHERE m.id IS NULL",
)[0].values[0][0];
if (orphanCourseItems) throw new Error("Existem itens de curso sem módulo.");
const orphanPlanSteps = db.exec(
    "SELECT COUNT(*) FROM study_plan_steps s LEFT JOIN study_plans p ON p.id = s.study_plan_id WHERE p.id IS NULL",
)[0].values[0][0];
if (orphanPlanSteps) throw new Error("Existem etapas de plano sem plano.");
const editorial = db.exec("SELECT COUNT(*) FROM learning_courses")[0].values[0][0];
if (!editorial) throw new Error("O snapshot não contém cursos editoriais.");
const assessmentSets = db.exec("SELECT COUNT(*) FROM assessment_sets")[0].values[0][0];
if (!assessmentSets) throw new Error("O snapshot não contém conjuntos avaliativos.");
const invalidBlocks = db.exec(
    "SELECT COUNT(*) FROM lesson_sections WHERE json_valid(blocks_json) = 0",
)[0].values[0][0];
if (invalidBlocks) throw new Error("Existem blocos editoriais com JSON inválido.");
const invalidRoles = db.exec(
    "SELECT COUNT(*) FROM lesson_sections WHERE pedagogical_role NOT IN ('context', 'analogy', 'intuition', 'formalization', 'limitation', 'example', 'guided_practice', 'independent_practice', 'application', 'review')",
)[0].values[0][0];
if (invalidRoles) throw new Error("Existem seções com papel pedagógico inválido.");
const incompleteLessons = db.exec(
    "SELECT COUNT(*) FROM lessons l WHERE l.is_published = 1 AND EXISTS (SELECT 1 FROM (SELECT 'context' role UNION ALL SELECT 'analogy' UNION ALL SELECT 'intuition' UNION ALL SELECT 'formalization' UNION ALL SELECT 'limitation' UNION ALL SELECT 'example' UNION ALL SELECT 'guided_practice' UNION ALL SELECT 'independent_practice' UNION ALL SELECT 'application' UNION ALL SELECT 'review') required WHERE NOT EXISTS (SELECT 1 FROM lesson_sections ls WHERE ls.lesson_id = l.id AND ls.pedagogical_role = required.role))",
)[0].values[0][0];
if (incompleteLessons)
    throw new Error(
        `Existem ${incompleteLessons} aula(s) publicadas sem a progressão pedagógica completa.`,
    );
const invalidLessonMetadata = db.exec(
    "SELECT COUNT(*) FROM lessons WHERE content_key IS NULL OR objective IS NULL OR audience IS NULL OR editorial_version IS NULL OR review_status IS NULL",
)[0].values[0][0];
if (invalidLessonMetadata) throw new Error("Existem aulas sem metadados editoriais obrigatórios.");
console.log(
    `Snapshot válido: ${count} questão(ões), ${processes} processos, ${editorial} curso(s), ${assessmentSets} conjunto(s) avaliativo(s) e ${tables.length} tabela(s).`,
);
