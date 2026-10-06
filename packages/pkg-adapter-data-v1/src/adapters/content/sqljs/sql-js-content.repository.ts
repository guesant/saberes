import { CatalogCardType } from "@guesant/saberes-domain";
import { getCatalogFilters } from "./get-catalog-filters.function";
import { getContentIdentifier } from "./get-content-identifier.function";
import { mapAssessmentCatalogCard } from "./map-assessment-catalog-card.function";
import { readContentAssessment } from "./read-content-assessment.function";
import { readContentQuestion } from "./read-content-question.function";
import { readContentTopic } from "./read-content-topic.function";
import type { ContentRepositoryContract } from "./content-repository.contract";
import type { ContentDatabaseProviderContract } from "./database/content-database-provider.contract";
import type { ContentDatabase } from "./database/content-database.type";
import type {
  AssessmentReadModel,
  CatalogFilters,
  CatalogReadModel,
  ContentReleaseReadModel,
  ContentKey,
  CourseReadModel,
  LessonReadModel,
  QuestionReadModel,
  StudyPlanReadModel,
  TopicReadModel,
  TopicMapReadModel,
} from "@guesant/saberes-application";

export class SqlJsContentRepository implements ContentRepositoryContract {
  public constructor(private readonly provider: ContentDatabaseProviderContract) {}

  private databaseValue?: ContentDatabase;

  private databasePromise?: Promise<ContentDatabase>;

  private database(): Promise<ContentDatabase> {
    if (this.databaseValue) {
      return Promise.resolve(this.databaseValue);
    }

    if (!this.databasePromise) {
      this.databasePromise = this.provider.execute()
        .then((database) => {
          this.databaseValue = database;

          return database;
        })
        .finally(() => {
          this.databasePromise = undefined;
        });
    }

    return this.databasePromise;
  }

  async getCatalog(filters: CatalogFilters = {}): Promise<CatalogReadModel> {
    const db = await this.database();

    const normalizedFilters = getCatalogFilters(filters);

    const courses = db.query(
      "SELECT c.*, COUNT(DISTINCT m.id) module_count, COALESCE(SUM(i.duration_minutes), 0) total_minutes FROM learning_courses c LEFT JOIN learning_course_modules m ON m.learning_course_id = c.id LEFT JOIN learning_course_items i ON i.module_id = m.id WHERE c.is_published = 1 GROUP BY c.id ORDER BY c.course_type, c.title",
    );

    const maps = db.query(
      "SELECT m.*, e.year, ap.name process_name, COUNT(DISTINCT mt.curriculum_topic_id) topic_count FROM learning_maps m LEFT JOIN editions e ON e.id = m.edition_id LEFT JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN learning_map_topics mt ON mt.map_id = m.id WHERE m.is_published = 1 GROUP BY m.id ORDER BY m.title",
    );

    const plans = db.query(
      "SELECT p.*, e.year, ap.name process_name, COUNT(s.id) step_count FROM study_plans p LEFT JOIN editions e ON e.id = p.edition_id LEFT JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN study_plan_steps s ON s.study_plan_id = p.id WHERE p.is_published = 1 GROUP BY p.id ORDER BY p.title",
    );

    const lessons = db.query(
      "SELECT id, slug, title, intro description FROM lessons WHERE is_published = 1 ORDER BY title",
    );

    const resources = db.query(
      "SELECT id, title, description, provider, url FROM resources WHERE is_published = 1 ORDER BY title",
    );

    const questions = db.query(
      "SELECT qo.id, qo.number, e.year, ap.name process_name FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id WHERE q.status = 'published' ORDER BY e.year DESC, qo.number",
    );

    const assessments = db.query(
      "SELECT a.id, a.slug, a.title, a.description, a.duration_minutes, e.year, ap.name process_name, COUNT(asi.position) question_count FROM assessment_sets a LEFT JOIN editions e ON e.id = a.edition_id LEFT JOIN admission_processes ap ON ap.id = COALESCE(a.admission_process_id, e.admission_process_id) LEFT JOIN assessment_set_items asi ON asi.assessment_set_id = a.id AND asi.item_type = 'question' WHERE a.is_published = 1 GROUP BY a.id ORDER BY e.year DESC, a.title",
    );

    const { search } = normalizedFilters;

    const { processName } = normalizedFilters;

    const hasYearMatch = (value: unknown) => {
      return !normalizedFilters.year || Number(value || 0) === normalizedFilters.year;
    };

    const hasProcessMatch = (value: unknown) => {
      return (
        !processName ||
        String(value || "")
          .toLocaleLowerCase()
          .includes(processName)
      );
    };

    const hasCourseTypeMatch = (value: unknown) => {
      return !normalizedFilters.courseType || String(value || "") === normalizedFilters.courseType;
    };

    const hasCatalogMatch = (value: unknown) => {
      return (
        !search ||
        String(value || "")
          .toLocaleLowerCase()
          .includes(search)
      );
    };

    return {
      courses: courses
        .filter((item) => {
          return (
            hasCatalogMatch(`${item.title} ${item.description || ""}`) &&
            hasCourseTypeMatch(item.course_type)
          );
        })
        .map((item) => {
          return {
            ...item,
            id: item.id as number,
            title: String(item.title),
            type: CatalogCardType.Course,
            slug: String(item.slug),
            description: String(item.description || ""),
            moduleCount: Number(item.module_count || 0),
            totalMinutes: Number(item.total_minutes || 0),
            courseType: String(item.course_type || ""),
          };
        }),
      maps: maps
        .filter((item) => {
          return (
            hasCatalogMatch(`${item.title} ${item.description || ""}`) &&
            hasProcessMatch(item.process_name) &&
            hasYearMatch(item.year)
          );
        })
        .map((item) => {
          return {
            ...item,
            id: item.id as number,
            title: String(item.title),
            type: CatalogCardType.Map,
            slug: String(item.slug),
            description: String(item.description || ""),
            topicCount: Number(item.topic_count || 0),
            processName: String(item.process_name || ""),
            year: Number(item.year || 0),
          };
        }),
      plans: plans
        .filter((item) => {
          return (
            hasCatalogMatch(`${item.title} ${item.description || ""}`) &&
            hasProcessMatch(item.process_name) &&
            hasYearMatch(item.year)
          );
        })
        .map((item) => {
          return {
            ...item,
            id: item.id as number,
            title: String(item.title),
            type: CatalogCardType.Plan,
            slug: String(item.slug),
            description: String(item.description || ""),
            stepCount: Number(item.step_count || 0),
            processName: String(item.process_name || ""),
            year: Number(item.year || 0),
          };
        }),
      content: [
        ...lessons
          .filter((item) => {
            return hasCatalogMatch(`${item.title} ${item.description || ""}`);
          })
          .map((item) => {
            return {
              ...item,
              id: item.id as number,
              title: String(item.title),
              type: CatalogCardType.Lesson,
              slug: String(item.slug),
              description: String(item.description || ""),
            };
          }),
        ...resources
          .filter((item) => {
            return hasCatalogMatch(`${item.title} ${item.description || ""}`);
          })
          .map((item) => {
            return {
              ...item,
              id: item.id as number,
              title: String(item.title),
              type: CatalogCardType.Resource,
              description: String(item.description || ""),
              href: String(item.url || ""),
              meta: String(item.provider || ""),
            };
          }),
        ...questions
          .map((item) => {
            return {
              ...item,
              id: item.id as number,
              title: `${item.process_name} ${item.year} · questão ${item.number}`,
              type: CatalogCardType.Question,
              description: "Questão de prova",
              processName: String(item.process_name || ""),
              year: Number(item.year || 0),
            };
          })
          .filter((item) => {
            return (
              hasCatalogMatch(item.title) &&
              hasProcessMatch(item.processName) &&
              hasYearMatch(item.year)
            );
          }),
        ...assessments
          .map(mapAssessmentCatalogCard)
          .filter((item) => {
            return (
              hasCatalogMatch(`${item.title} ${item.description || ""} ${item.meta || ""}`) &&
              hasProcessMatch(item.processName) &&
              hasYearMatch(item.year)
            );
          }),
      ],
    };
  }

  async getCourse(slug: string): Promise<CourseReadModel | null> {
    const db = await this.database();

    const course = db.query("SELECT * FROM learning_courses WHERE slug = ? AND is_published = 1", [
      slug,
    ])[0];

    if (!course) {
      return null;
    }

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

    const value = getContentIdentifier(key);

    const lesson = db.query(
      "SELECT * FROM lessons WHERE (slug = ? OR id = ?) AND is_published = 1",
      [value, Number(value) || 0],
    )[0];

    if (!lesson) {
      return null;
    }

    return {
      lesson,
      sections: db.query("SELECT * FROM lesson_sections WHERE lesson_id = ? ORDER BY position", [
        lesson.id,
      ]),
      sources: db.query(
        "SELECT sd.title, sd.url, sd.provider, sd.kind FROM lesson_sources ls JOIN source_documents sd ON sd.id = ls.source_document_id WHERE ls.lesson_id = ? ORDER BY sd.title",
        [lesson.id],
      ),
    };
  }

  async getQuestion(key: ContentKey | string): Promise<QuestionReadModel | null> {
    const db = await this.database();

    return readContentQuestion(db, key);
  }

  async getAssessment(key: ContentKey | string): Promise<AssessmentReadModel | null> {
    const db = await this.database();

    return readContentAssessment(db, key);
  }

  async getContentRelease(): Promise<ContentReleaseReadModel | null> {
    const db = await this.database();

    const release = db.query(
      "SELECT version, schema_version, generated_at, notes FROM content_releases ORDER BY generated_at DESC, id DESC LIMIT 1",
    )[0];

    if (!release) {
      return null;
    }

    return {
      version: String(release.version || ""),
      schemaVersion: Number(release.schema_version || 0),
      generatedAt: String(release.generated_at || ""),
      notes: String(release.notes || ""),
      source: db.source,
    };
  }

  async getTopicMap(mapKey: string): Promise<TopicMapReadModel | null> {
    const db = await this.database();

    const map = db.query(
      "SELECT * FROM learning_maps WHERE is_published = 1 AND (? = '' OR slug = ?) ORDER BY id LIMIT 1",
      [mapKey, mapKey],
    )[0];

    if (!map) {
      return null;
    }

    return {
      map,
      nodes: db.query(
        "SELECT mt.*, ct.label, ct.description, t.slug FROM learning_map_topics mt JOIN curriculum_topics ct ON ct.id = mt.curriculum_topic_id JOIN topics t ON t.id = ct.topic_id WHERE mt.map_id = ? ORDER BY mt.position",
        [map.id],
      ),
      edges: db.query("SELECT * FROM learning_map_edges WHERE map_id = ?", [map.id]),
    };
  }

  async getTopic(slug: string): Promise<TopicReadModel | null> {
    const db = await this.database();

    return readContentTopic(db, slug);
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
        ? db.query("SELECT * FROM study_plan_steps WHERE study_plan_id = ? ORDER BY position", [
          plan.id,
        ])
        : [],
    };
  }
}
