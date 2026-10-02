import { loadContentDatabase } from "../../../db/content";
import type {
    AssessmentReadModel,
    CatalogFilters,
    CatalogReadModel,
    ContentKey,
    CourseReadModel,
    LessonReadModel,
    QuestionReadModel,
    StudyPlanReadModel,
    TopicMapReadModel,
} from "@guesant/saberes-core";
import { CatalogCardType } from "@guesant/saberes-core";
import type { ContentPort } from "@guesant/saberes-core";

type SqlDatabase = {
    query(sql: string, params?: unknown[]): Record<string, unknown>[];
};

function keyId(key: ContentKey | string) {
    return String(key).replace(/^[a-z]+:/, "");
}

export class SqlJsContentAdapter implements ContentPort {
    private databasePromise?: Promise<SqlDatabase>;

    private database() {
        this.databasePromise ||= loadContentDatabase() as unknown as Promise<SqlDatabase>;
        return this.databasePromise;
    }

    async getCatalog(filters: CatalogFilters = {}): Promise<CatalogReadModel> {
        const db = await this.database();
        const courses = db.query(
            "SELECT c.*, COUNT(DISTINCT m.id) module_count, COALESCE(SUM(i.duration_minutes), 0) total_minutes FROM learning_courses c LEFT JOIN learning_course_modules m ON m.learning_course_id = c.id LEFT JOIN learning_course_items i ON i.module_id = m.id WHERE c.is_published = 1 GROUP BY c.id ORDER BY c.course_type, c.title",
        );
        const maps = db.query(
            "SELECT m.*, e.year, ap.name process_name, COUNT(DISTINCT mt.curriculum_topic_id) topic_count FROM learning_maps m LEFT JOIN editions e ON e.id = m.edition_id LEFT JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN learning_map_topics mt ON mt.map_id = m.id WHERE m.is_published = 1 GROUP BY m.id ORDER BY m.title",
        );
        const plans = db.query(
            "SELECT p.*, e.year, COUNT(s.id) step_count FROM study_plans p LEFT JOIN editions e ON e.id = p.edition_id LEFT JOIN study_plan_steps s ON s.study_plan_id = p.id WHERE p.is_published = 1 GROUP BY p.id ORDER BY p.title",
        );
        const lessons = db.query(
            "SELECT id, slug, title, intro description FROM lessons WHERE is_published = 1 ORDER BY title",
        );
        const resources = db.query(
            "SELECT id, title, description, provider, url FROM resources WHERE is_published = 1 ORDER BY title",
        );
        const questions = db.query(
            "SELECT qo.id, qo.number, e.year, ap.name process_name FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id WHERE q.status = 'published' ORDER BY e.year DESC, qo.number LIMIT 40",
        );
        const search = filters.search?.trim().toLocaleLowerCase();
        const matches = (value: unknown) =>
            !search ||
            String(value || "")
                .toLocaleLowerCase()
                .includes(search);

        return {
            courses: courses
                .filter((item) => matches(`${item.title} ${item.description || ""}`))
                .map((item) => ({
                    ...item,
                    id: item.id as number,
                    title: String(item.title),
                    type: CatalogCardType.Course,
                    slug: String(item.slug),
                    description: String(item.description || ""),
                    moduleCount: Number(item.module_count || 0),
                    totalMinutes: Number(item.total_minutes || 0),
                    courseType: String(item.course_type || ""),
                })),
            maps: maps
                .filter((item) => matches(`${item.title} ${item.description || ""}`))
                .map((item) => ({
                    ...item,
                    id: item.id as number,
                    title: String(item.title),
                    type: CatalogCardType.Map,
                    slug: String(item.slug),
                    description: String(item.description || ""),
                    topicCount: Number(item.topic_count || 0),
                    processName: String(item.process_name || ""),
                    year: Number(item.year || 0),
                })),
            plans: plans
                .filter((item) => matches(`${item.title} ${item.description || ""}`))
                .map((item) => ({
                    ...item,
                    id: item.id as number,
                    title: String(item.title),
                    type: CatalogCardType.Plan,
                    slug: String(item.slug),
                    description: String(item.description || ""),
                    stepCount: Number(item.step_count || 0),
                    year: Number(item.year || 0),
                })),
            content: [
                ...lessons
                    .filter((item) => matches(`${item.title} ${item.description || ""}`))
                    .map((item) => ({
                        ...item,
                        id: item.id as number,
                        title: String(item.title),
                        type: CatalogCardType.Lesson,
                        slug: String(item.slug),
                        description: String(item.description || ""),
                    })),
                ...resources
                    .filter((item) => matches(`${item.title} ${item.description || ""}`))
                    .map((item) => ({
                        ...item,
                        id: item.id as number,
                        title: String(item.title),
                        type: CatalogCardType.Resource,
                        description: String(item.description || ""),
                        href: String(item.url || ""),
                        meta: String(item.provider || ""),
                    })),
                ...questions
                    .map((item) => ({
                        ...item,
                        id: item.id as number,
                        title: `${item.process_name} ${item.year} · questão ${item.number}`,
                        type: CatalogCardType.Question,
                        description: "Questão de prova",
                        processName: String(item.process_name || ""),
                        year: Number(item.year || 0),
                    }))
                    .filter((item) => matches(item.title)),
            ],
        };
    }

    async getCourse(slug: string): Promise<CourseReadModel | null> {
        const db = await this.database();
        const course = db.query(
            "SELECT * FROM learning_courses WHERE slug = ? AND is_published = 1",
            [slug],
        )[0];
        if (!course) return null;
        return {
            course,
            modules: db.query(
                "SELECT * FROM learning_course_modules WHERE learning_course_id = ? ORDER BY position",
                [course.id],
            ),
            items: db.query(
                "SELECT i.*, l.slug lesson_slug FROM learning_course_items i LEFT JOIN lessons l ON l.id = i.lesson_id JOIN learning_course_modules m ON m.id = i.module_id WHERE m.learning_course_id = ? ORDER BY m.position, i.position",
                [course.id],
            ),
        };
    }

    async getLesson(key: ContentKey | string): Promise<LessonReadModel | null> {
        const db = await this.database();
        const value = keyId(key);
        const lesson = db.query(
            "SELECT * FROM lessons WHERE (slug = ? OR id = ?) AND is_published = 1",
            [value, Number(value) || 0],
        )[0];
        if (!lesson) return null;
        return {
            lesson,
            sections: db.query(
                "SELECT * FROM lesson_sections WHERE lesson_id = ? ORDER BY position",
                [lesson.id],
            ),
        };
    }

    async getQuestion(key: ContentKey | string): Promise<QuestionReadModel | null> {
        const db = await this.database();
        const id = Number(keyId(key));
        const question = db.query(
            "SELECT qo.id occurrence_id, qo.occurrence_key, q.id question_id, q.type, q.statement, q.explanation, q.difficulty, qo.number, e.year, ap.name process_name, s.name subject, ak.answer_value correct_answer, ak.is_automatically_gradable FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id LEFT JOIN answer_keys ak ON ak.question_occurrence_id = qo.id AND ak.question_part_id IS NULL WHERE qo.id = ? AND q.status = 'published'",
            [id],
        )[0];
        if (!question) return null;
        return {
            question,
            options: db.query(
                "SELECT * FROM question_options WHERE question_id = ? ORDER BY position",
                [question.question_id],
            ),
            parts: db.query(
                "SELECT * FROM question_parts WHERE question_id = ? ORDER BY position",
                [question.question_id],
            ),
            topics: db.query(
                "SELECT curriculum_topic_id topic_id FROM question_topics WHERE question_occurrence_id = ?",
                [id],
            ),
            related: db.query(
                "SELECT DISTINCT qo2.id, qo2.number FROM question_topics qt1 JOIN question_topics qt2 ON qt2.curriculum_topic_id = qt1.curriculum_topic_id JOIN question_occurrences qo2 ON qo2.id = qt2.question_occurrence_id WHERE qt1.question_occurrence_id = ? AND qo2.id <> ? LIMIT 4",
                [id, id],
            ),
        };
    }

    async getAssessment(key: ContentKey | string): Promise<AssessmentReadModel | null> {
        const db = await this.database();
        const id = Number(keyId(key));
        const assessment = db.query(
            "SELECT * FROM assessment_sets WHERE id = ? AND is_published = 1",
            [id],
        )[0];
        if (!assessment) return null;
        return {
            assessment,
            items: db.query(
                "SELECT * FROM assessment_set_items WHERE assessment_set_id = ? ORDER BY position",
                [id],
            ),
        };
    }

    async getTopicMap(mapKey: string): Promise<TopicMapReadModel | null> {
        const db = await this.database();
        const map = db.query(
            "SELECT * FROM learning_maps WHERE is_published = 1 AND (? = '' OR slug = ?) ORDER BY id LIMIT 1",
            [mapKey, mapKey],
        )[0];
        if (!map) return null;
        return {
            map,
            nodes: db.query(
                "SELECT mt.*, ct.label, ct.description, t.slug FROM learning_map_topics mt JOIN curriculum_topics ct ON ct.id = mt.curriculum_topic_id JOIN topics t ON t.id = ct.topic_id WHERE mt.map_id = ? ORDER BY mt.position",
                [map.id],
            ),
            edges: db.query("SELECT * FROM learning_map_edges WHERE map_id = ?", [map.id]),
        };
    }

    async getStudyPlan(slug = ""): Promise<StudyPlanReadModel> {
        const db = await this.database();
        const plan =
            db.query("SELECT * FROM study_plans WHERE is_published = 1 AND (? = '' OR slug = ?)", [
                slug,
                slug,
            ])[0] || null;
        return {
            plan,
            steps: plan
                ? db.query(
                      "SELECT * FROM study_plan_steps WHERE study_plan_id = ? ORDER BY position",
                      [plan.id],
                  )
                : [],
        };
    }
}
