import type { ContentDatabase } from "./content-database.type";

const course = {
  id: 1,
  slug: "curso-sintetico-primeiro-estudo",
  title: "Primeiro estudo",
  description: "Uma fixture local para testar o ciclo de estudo sem conteúdo editorial publicado.",
  course_type: "general",
  is_published: 1,
};

const module = {
  id: 1,
  learning_course_id: 1,
  title: "Comece por aqui",
  position: 1,
};

const lesson = {
  id: 1,
  slug: "primeiro-conceito",
  title: "Um primeiro conceito",
  intro: "Leia uma explicação curta e pratique com uma questão local.",
  objective: "Reconhecer a ideia principal de um exemplo simples.",
  audience: "Iniciante",
  level: "basic",
  estimated_minutes: 5,
  is_published: 1,
};

const question = {
  id: 1,
  occurrence_id: 1,
  occurrence_key: "question:fixture-primeiro-estudo",
  question_id: 1,
  type: "single_choice",
  statement: "Qual alternativa representa melhor o objetivo desta fixture?",
  explanation: "A alternativa correta destaca compreensão e prática em sequência.",
  difficulty: "basic",
  number: 1,
  year: 2026,
  process_name: "Fixture local",
  subject: "Estudo",
  correct_answer: "a",
  is_automatically_gradable: 1,
};

const topic = {
  id: 1,
  slug: "primeiro-conceito",
  name: "Primeiro conceito",
  label: "Primeiro conceito",
  description: "Tópico sintético para validar navegação, prática e progresso local.",
};

const plan = {
  id: 1,
  slug: "plano-primeiro-estudo",
  title: "Plano do primeiro estudo",
  description: "Uma etapa curta para validar retomada e progresso no dispositivo.",
  objective: "Completar uma lição e uma questão.",
  is_published: 1,
};

const map = {
  id: 1,
  slug: "mapa-primeiro-estudo",
  title: "Mapa do primeiro estudo",
  description: "Relação sintética entre o tópico e a prática.",
  is_published: 1,
};

export function createSyntheticContentDatabase(): ContentDatabase {
  const executeSyntheticContentQuery: ContentDatabase["query"] = (sql, params) => {
    const firstParameter = String(params?.[0] ?? "");

    if (sql.includes("FROM learning_courses") && sql.includes("COUNT(DISTINCT")) {
      return [{ ...course, module_count: 1, total_minutes: 5 }];
    }

    if (sql.includes("FROM learning_courses WHERE")) {
      return firstParameter === course.slug || firstParameter === "1" ? [course] : [];
    }

    if (sql.includes("FROM learning_course_modules")) {
      return [module];
    }

    if (sql.includes("FROM learning_course_items")) {
      return [
        {
          id: 1,
          module_id: 1,
          type: "lesson",
          lesson_id: 1,
          lesson_slug: lesson.slug,
          title: lesson.title,
          duration_minutes: 5,
          position: 1,
        },
        {
          id: 2,
          module_id: 1,
          type: "practice",
          question_id: 1,
          title: "Prática local",
          duration_minutes: 3,
          position: 2,
        },
      ];
    }

    if (sql.includes("FROM lessons WHERE")) {
      return firstParameter === lesson.slug || firstParameter === "1" ? [lesson] : [];
    }

    if (sql.includes("FROM lessons WHERE is_published")) {
      return [{ id: lesson.id, slug: lesson.slug, title: lesson.title, description: lesson.intro }];
    }

    if (sql.includes("FROM lesson_sections")) {
      return [
        {
          id: 1,
          lesson_id: 1,
          slug: "contexto",
          title: "Contexto",
          position: 1,
          content: "Comece observando o problema antes de escolher uma resposta.",
          format: "markdown",
          type: "theory",
          pedagogical_role: "context",
        },
        {
          id: 2,
          lesson_id: 1,
          slug: "pratica",
          title: "Prática",
          position: 2,
          content: "Agora teste a compreensão na questão relacionada.",
          format: "markdown",
          type: "practice",
          pedagogical_role: "independent_practice",
        },
      ];
    }

    if (sql.includes("FROM lesson_sources")) {
      return [];
    }

    if (sql.includes("FROM lesson_topics")) {
      return [{ id: topic.id, slug: topic.slug, title: topic.name, description: topic.description }];
    }

    if (sql.includes("SELECT qo.id occurrence_id")) {
      return firstParameter === "1" ? [question] : [];
    }

    if (sql.includes("FROM question_options")) {
      return [
        { id: 1, question_id: 1, label: "a", text: "Compreender e praticar.", position: 1 },
        { id: 2, question_id: 1, label: "b", text: "Pular toda a explicação.", position: 2 },
      ];
    }

    if (sql.includes("FROM question_parts")) {
      return [];
    }

    if (sql.includes("SELECT DISTINCT qo2.id")) {
      return [];
    }

    if (sql.includes("FROM question_topics")) {
      return [{ curriculum_topic_id: 1, topic_id: 1 }];
    }

    if (sql.includes("FROM assessment_sets")) {
      if (sql.includes("FROM assessment_sets a")) {
        return [
          {
            id: 1,
            slug: "assessment-primeiro-estudo",
            title: "Prática do primeiro estudo",
            description: "Uma avaliação sintética.",
            duration_minutes: 5,
            year: 2026,
            process_name: "Fixture local",
            question_count: 1,
          },
        ];
      }

      return firstParameter === "1" || firstParameter === "assessment-primeiro-estudo"
        ? [
          {
            id: 1,
            slug: "assessment-primeiro-estudo",
            title: "Prática do primeiro estudo",
            description: "Uma avaliação sintética.",
            is_published: 1,
            kind: "question_set",
            duration_minutes: 5,
            expected_question_count: 1,
          },
        ]
        : [];
    }

    if (sql.includes("FROM assessment_set_items")) {
      return [{ id: 1, assessment_set_id: 1, item_type: "question", question_id: 1, question_occurrence_id: 1, question_slug: "primeiro-estudo", title: question.statement, points: 1, position: 1 }];
    }

    if (sql.includes("FROM content_releases")) {
      return [
        {
          version: "fixture-local-1",
          schema_version: 1,
          generated_at: "2026-10-04T00:00:00.000Z",
          notes: "Dados sintéticos locais para o primeiro estudo.",
        },
      ];
    }

    if (sql.includes("FROM learning_maps") && sql.includes("COUNT(DISTINCT")) {
      return [{ ...map, year: 2026, process_name: "Fixture local", topic_count: 1 }];
    }

    if (sql.includes("FROM learning_maps WHERE")) {
      return firstParameter === "" || firstParameter === map.slug ? [map] : [];
    }

    if (sql.includes("FROM learning_map_topics")) {
      return [
        {
          id: 1,
          map_id: 1,
          curriculum_topic_id: 1,
          label: topic.label,
          description: topic.description,
          slug: topic.slug,
          position: 1,
        },
      ];
    }

    if (sql.includes("FROM learning_map_edges")) {
      return [];
    }

    if (sql.includes("FROM topics WHERE slug")) {
      return firstParameter === topic.slug ? [topic] : [];
    }

    if (sql.includes("SELECT slug, name, description FROM topics")) {
      return [];
    }

    if (sql.includes("SELECT DISTINCT l.id")) {
      return [{ id: lesson.id, slug: lesson.slug, title: lesson.title, description: lesson.intro }];
    }

    if (sql.includes("SELECT DISTINCT qo.id")) {
      return [{ id: 1, occurrence_id: 1, slug: "primeiro-estudo", number: 1, statement: question.statement, difficulty: question.difficulty }];
    }

    if (sql.includes("FROM topic_relations")) {
      return [];
    }

    if (sql.includes("FROM study_plans") && sql.includes("COUNT(s.id)")) {
      return [{ ...plan, year: 2026, process_name: "Fixture local", step_count: 1 }];
    }

    if (sql.includes("FROM study_plans WHERE")) {
      return firstParameter === "" || firstParameter === plan.slug ? [plan] : [];
    }

    if (sql.includes("FROM study_plan_steps")) {
      return [
        {
          id: 1,
          study_plan_id: 1,
          title: lesson.title,
          item_type: "lesson",
          item_id: 1,
          position: 1,
        },
      ];
    }

    if (sql.includes("FROM resources")) {
      return [];
    }

    return [];
  };

  return {
    source: "synthetic-fixture",
    query: executeSyntheticContentQuery,
    get(sql, params) {
      return executeSyntheticContentQuery(sql, params)[0] ?? null;
    },
  };
}
