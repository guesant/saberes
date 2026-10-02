import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";
import {
    AdmissionProcessCode,
    AdmissionProcessKind,
    AssessmentItemType,
    AssessmentSetKind,
    ContentFormat,
    LearningCourseItemType,
    LearningCourseType,
    LessonSectionType,
    OrganizerCode,
    OrganizerType,
    PaperKind,
    PedagogicalRole,
    QuestionStatus,
    QuestionTopicRelationType,
    QuestionType,
    ReviewStatus,
    StageKind,
    TopicRelationType,
    UniversityCode,
} from "@guesant/saberes-core";

const root = process.cwd();
const sourcePath =
    process.env.SOURCE_DB || path.join(root, ".local/content/source.sqlite");
const outputPath =
    process.env.OUTPUT_DB || path.join(root, ".local/content/content.sqlite");
const migrationDbPath = path.join(root, ".cache/content/editorial.sqlite");
const schemaPath = path.join(root, ".config/dbmate/schema.sql");
const now = new Date().toISOString();

if (!fs.existsSync(sourcePath))
    throw new Error(`Banco de origem não encontrado: ${sourcePath}`);

const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
});
const source = new SQL.Database(fs.readFileSync(sourcePath));
fs.mkdirSync(path.dirname(migrationDbPath), { recursive: true });
if (fs.existsSync(migrationDbPath)) fs.rmSync(migrationDbPath);
const schema = fs
    .readFileSync(schemaPath, "utf8")
    .split("-- migrate:down", 1)[0]
    .replace(/^-- migrate:up\s*/, "");
const bootstrap = new SQL.Database();
bootstrap.run(schema);
fs.writeFileSync(migrationDbPath, Buffer.from(bootstrap.export()));
const migration = new Deno.Command("dbmate", {
    args: [
        "--url",
        `sqlite:${migrationDbPath}`,
        "--migrations-dir",
        ".config/dbmate/migrations",
        "--no-dump-schema",
        "up",
    ],
    cwd: root,
    stdout: "piped",
    stderr: "piped",
}).output();
const migrationResult = await migration;
if (!migrationResult.success) {
    throw new Error(
        `Falha ao aplicar migrations do Dbmate:\n${new TextDecoder().decode(migrationResult.stderr)}`,
    );
}
const target = new SQL.Database(fs.readFileSync(migrationDbPath));
target.run("PRAGMA foreign_keys = ON");

function oldRows(table) {
    try {
        const result = source.exec(`SELECT * FROM ${table}`)[0];
        if (!result) return [];
        return result.values.map((values) =>
            Object.fromEntries(
                result.columns.map((column, index) => [column, values[index]]),
            ),
        );
    } catch {
        return [];
    }
}

function insert(table, data) {
    const columns = Object.keys(data);
    const statement = target.prepare(
        `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    );
    statement.run(columns.map((column) => data[column] ?? null));
    statement.free();
    return target.exec("SELECT last_insert_rowid() AS id")[0].values[0][0];
}

function find(table, column, value) {
    return (
        target.exec(`SELECT id FROM ${table} WHERE ${column} = ?`, [value])[0]
            ?.values[0]?.[0] ?? null
    );
}

const old = {
    exams: oldRows("exams"),
    topics: oldRows("topics"),
    lessons: oldRows("lessons"),
    resources: oldRows("resources"),
    questions: oldRows("questions"),
    options: oldRows("question_options"),
    questionTopics: oldRows("question_topic"),
    topicResources: oldRows("topic_resource"),
    relations: oldRows("question_relations"),
};

const university = {
    unicamp: insert("universities", {
        slug: UniversityCode.Unicamp,
        name: "Universidade Estadual de Campinas",
        acronym: "Unicamp",
        website: "https://www.unicamp.br",
        state: "SP",
        city: "Campinas",
    }),
    usp: insert("universities", {
        slug: UniversityCode.Usp,
        name: "Universidade de São Paulo",
        acronym: "USP",
        website: "https://www5.usp.br",
        state: "SP",
        city: "São Paulo",
    }),
};
const organizer = {
    comvest: insert("organizers", {
        slug: OrganizerCode.Comvest,
        name: "Comvest",
        type: OrganizerType.ExamBoard,
        website: "https://www.comvest.unicamp.br",
    }),
    fuvest: insert("organizers", {
        slug: OrganizerCode.Fuvest,
        name: "Fuvest",
        type: OrganizerType.ExamBoard,
        website: "https://www.fuvest.br",
    }),
    inep: insert("organizers", {
        slug: OrganizerCode.Inep,
        name: "Inep",
        type: OrganizerType.Government,
        website: "https://www.gov.br/inep",
    }),
};
const admissionProcess = {
    unicamp: insert("admission_processes", {
        university_id: university.unicamp,
        organizer_id: organizer.comvest,
        slug: "vestibular-unicamp",
        name: "Vestibular Unicamp",
        kind: AdmissionProcessKind.Vestibular,
        description: "Processo seletivo da Unicamp.",
        website: "https://www.comvest.unicamp.br",
    }),
    fuvest: insert("admission_processes", {
        university_id: university.usp,
        organizer_id: organizer.fuvest,
        slug: "fuvest",
        name: "Fuvest",
        kind: AdmissionProcessKind.Vestibular,
        description: "Processo seletivo para a USP.",
        website: "https://www.fuvest.br",
    }),
    enem: insert("admission_processes", {
        organizer_id: organizer.inep,
        slug: "enem",
        name: "ENEM",
        kind: AdmissionProcessKind.NationalExam,
        description: "Exame Nacional do Ensino Médio.",
        website:
            "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem",
    }),
};

const area = {};
for (const [slug, name] of [
    ["linguagens", "Linguagens"],
    ["humanas", "Ciências Humanas"],
    ["natureza", "Ciências da Natureza"],
    ["matematica", "Matemática"],
])
    area[slug] = insert("assessment_areas", { slug, name });
const subject = {};
for (const [slug, name, areaSlug] of [
    ["matematica", "Matemática", "matematica"],
    ["lingua-portuguesa", "Língua Portuguesa", "linguagens"],
    ["literatura", "Literatura", "linguagens"],
    ["ingles", "Inglês", "linguagens"],
    ["espanhol", "Espanhol", "linguagens"],
    ["historia", "História", "humanas"],
    ["geografia", "Geografia", "humanas"],
    ["filosofia", "Filosofia", "humanas"],
    ["sociologia", "Sociologia", "humanas"],
    ["fisica", "Física", "natureza"],
    ["quimica", "Química", "natureza"],
    ["biologia", "Biologia", "natureza"],
    ["redacao", "Redação", null],
])
    subject[slug] = insert("subjects", {
        slug,
        name,
        assessment_area_id: areaSlug ? area[areaSlug] : null,
    });

const language = {
    pt: insert("languages", { code: "pt-BR", name: "Português" }),
    en: insert("languages", { code: "en", name: "Inglês" }),
    es: insert("languages", { code: "es", name: "Espanhol" }),
};
const editions = {};
const stages = {};
const papers = {};

function addEdition(
    processKey,
    year,
    name = `${admissionProcess[processKey]} ${year}`,
) {
    const key = `${processKey}-${year}`;
    const editionId = insert("editions", {
        admission_process_id: admissionProcess[processKey],
        year,
        slug: key,
        name,
    });
    editions[key] = editionId;
    return editionId;
}
function addStage(
    editionKey,
    slug,
    name,
    kind,
    sequence = 1,
    dayNumber = null,
) {
    const stageId = insert("stages", {
        edition_id: editions[editionKey],
        slug,
        name,
        kind,
        sequence,
        day_number: dayNumber,
    });
    stages[`${editionKey}-${slug}`] = stageId;
    return stageId;
}
function addPaper(stageKey, slug, name, type = PaperKind.Objective) {
    const paperId = insert("papers", {
        stage_id: stages[stageKey],
        slug,
        name,
        paper_type: type,
    });
    papers[`${stageKey}-${slug}`] = paperId;
    return paperId;
}

for (const exam of old.exams) {
    const editionKey = `unicamp-${exam.year}`;
    addEdition("unicamp", exam.year, `Vestibular Unicamp ${exam.year}`);
    const stageKey = `${editionKey}-first-phase`;
    addStage(editionKey, "first-phase", "1ª fase", StageKind.Objective, 1);
    const sourceUrl =
        exam.source_url ||
        `https://www.comvest.unicamp.br/vestibulares-anteriores/${exam.year}`;
    const sourceId =
        find("source_documents", "url", sourceUrl) ||
        insert("source_documents", {
            title: `Prova Unicamp ${exam.year} — 1ª fase`,
            url: sourceUrl,
            provider: "Comvest",
            kind: "exam",
            is_official: 1,
        });
    const paperId = addPaper(
        stageKey,
        "main",
        `Prova da 1ª fase — ${exam.year}`,
    );
    target.run("UPDATE papers SET source_document_id = ? WHERE id = ?", [
        sourceId,
        paperId,
    ]);
}

addEdition(AdmissionProcessCode.Unicamp, 2027, "Vestibular Unicamp 2027");
for (const [slug, name, kind, sequence] of [
    ["first-phase", "1ª fase", StageKind.Objective, 1],
    ["second-phase", "2ª fase", StageKind.Discursive, 2],
    ["essay", "Redação", StageKind.Essay, 3],
]) {
    addStage("unicamp-2027", slug, name, kind, sequence);
    addPaper(
        `${"unicamp-2027"}-${slug}`,
        "main",
        `${name} — Vestibular Unicamp 2027`,
        kind === StageKind.Objective
            ? PaperKind.Objective
            : PaperKind.Discursive,
    );
}
addEdition(AdmissionProcessCode.Fuvest, 2027, "Fuvest 2027");
addStage("fuvest-2027", "first-phase", "1ª fase", StageKind.Objective, 1);
addPaper("fuvest-2027-first-phase", "main", "Prova da 1ª fase");
addStage("fuvest-2027", "second-phase", "2ª fase", StageKind.Discursive, 2);
addPaper(
    "fuvest-2027-second-phase",
    "portuguese",
    "Prova de Português",
    PaperKind.Discursive,
);
addPaper(
    "fuvest-2027-second-phase",
    "specific",
    "Prova específica",
    PaperKind.Discursive,
);
addStage("fuvest-2027", "essay", "Redação", StageKind.Essay, 3);
addPaper("fuvest-2027-essay", "main", "Redação Fuvest 2027", PaperKind.Essay);
addEdition(AdmissionProcessCode.Enem, 2027, "ENEM 2027");
addStage("enem-2027", "day-1", "1º dia", StageKind.Objective, 1, 1);
addPaper("enem-2027-day-1", "main", "Linguagens e Ciências Humanas");
addStage("enem-2027", "day-2", "2º dia", StageKind.Objective, 2, 2);
addPaper("enem-2027-day-2", "main", "Ciências da Natureza e Matemática");
addStage("enem-2027", "essay", "Redação", StageKind.Essay, 3);
addPaper("enem-2027-essay", "main", "Redação ENEM 2027", PaperKind.Essay);

for (const key of [
    "unicamp-2027-first-phase-main",
    "fuvest-2027-first-phase-main",
])
    insert("paper_versions", {
        paper_id: papers[key],
        code: "A",
        name: "Caderno A",
        color: null,
        language_id: language.pt,
    });
insert("paper_versions", {
    paper_id: papers["enem-2027-day-1-main"],
    code: "blue-en",
    name: "Caderno azul — Inglês",
    color: "blue",
    language_id: language.en,
});
insert("paper_versions", {
    paper_id: papers["enem-2027-day-1-main"],
    code: "blue-es",
    name: "Caderno azul — Espanhol",
    color: "blue",
    language_id: language.es,
});
insert("paper_versions", {
    paper_id: papers["enem-2027-day-2-main"],
    code: "blue",
    name: "Caderno azul",
    color: "blue",
    language_id: language.pt,
});

function subjectBelongsToPaper(paperName, stageSlug, processSlug, subjectSlug) {
    if (processSlug === "enem") {
        if (stageSlug === "day-1")
            return [
                "lingua-portuguesa",
                "literatura",
                "ingles",
                "espanhol",
                "historia",
                "geografia",
                "filosofia",
                "sociologia",
            ].includes(subjectSlug);
        if (stageSlug === "day-2")
            return ["matematica", "fisica", "quimica", "biologia"].includes(
                subjectSlug,
            );
        return subjectSlug === "redacao";
    }
    if (processSlug === "fuvest") {
        if (paperName.includes("Português"))
            return ["lingua-portuguesa", "literatura"].includes(subjectSlug);
        if (paperName.includes("específica"))
            return ["matematica", "fisica", "quimica", "biologia"].includes(
                subjectSlug,
            );
        return subjectSlug === "redacao";
    }
    return paperName.includes("Redação")
        ? subjectSlug === "redacao"
        : subjectSlug !== "redacao";
}

for (const paperId of Object.values(papers))
    for (const subjectId of Object.values(subject)) {
        const paper = target.exec(
            "SELECT p.name, st.slug, ap.slug FROM papers p JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id WHERE p.id = ?",
            [paperId],
        )[0].values[0];
        const [paperName, stageSlug, processSlug] = paper;
        const subjectRow = target.exec(
            "SELECT slug, assessment_area_id FROM subjects WHERE id = ?",
            [subjectId],
        )[0].values[0];
        const shouldAdd = subjectBelongsToPaper(
            paperName,
            stageSlug,
            processSlug,
            subjectRow[0],
        );
        if (shouldAdd)
            insert("paper_subjects", {
                paper_id: paperId,
                subject_id: subjectId,
                assessment_area_id: subjectRow[1],
                position: 0,
                question_count: null,
            });
    }

const topicIdByOld = {};
for (const topic of old.topics.filter((item) => !item.parent_id))
    topicIdByOld[topic.id] = insert("topics", {
        slug: topic.slug,
        name: topic.name,
        description: topic.description,
    });
for (const topic of old.topics.filter((item) => item.parent_id))
    topicIdByOld[topic.id] = insert("topics", {
        parent_id: topicIdByOld[topic.parent_id],
        slug: topic.slug,
        name: topic.name,
        description: topic.description,
    });
const subjectIdByName = Object.fromEntries(
    target
        .exec("SELECT id, name FROM subjects")[0]
        .values.map(([id, name]) => [name, id]),
);
for (const topic of old.topics)
    if (subjectIdByName[topic.subject])
        insert("topic_subjects", {
            topic_id: topicIdByOld[topic.id],
            subject_id: subjectIdByName[topic.subject],
        });
const curriculumByEdition = {};
const curriculumTopicByEditionOld = {};
for (const editionKey of Object.keys(editions)) {
    const curriculumId = insert("curricula", {
        edition_id: editions[editionKey],
        name: `Programa de provas — ${editionKey}`,
    });
    curriculumByEdition[editionKey] = curriculumId;
    curriculumTopicByEditionOld[editionKey] = {};
    for (const topic of old.topics.filter((item) => !item.parent_id)) {
        const id = insert("curriculum_topics", {
            curriculum_id: curriculumId,
            topic_id: topicIdByOld[topic.id],
            label: topic.name,
            description: topic.description,
            position: topic.position || 0,
        });
        curriculumTopicByEditionOld[editionKey][topic.id] = id;
        for (const child of old.topics.filter(
            (item) => item.parent_id === topic.id,
        ))
            curriculumTopicByEditionOld[editionKey][child.id] = insert(
                "curriculum_topics",
                {
                    curriculum_id: curriculumId,
                    topic_id: topicIdByOld[child.id],
                    parent_id: id,
                    label: child.name,
                    description: child.description,
                    position: child.position || 0,
                },
            );
    }
}

const oldExamById = Object.fromEntries(
    old.exams.map((exam) => [exam.id, exam.year]),
);
const occurrenceByOldQuestion = {};
const optionByOld = {};
for (const oldQuestion of old.questions) {
    const oldOptionCode = (option) => option.letter ?? option.code;
    const questionId = insert("questions", {
        slug: `legacy-${oldQuestion.id}`,
        type:
            oldQuestion.type === QuestionType.MultipleChoice
                ? QuestionType.SingleChoice
                : oldQuestion.type,
        statement: oldQuestion.statement,
        explanation: oldQuestion.explanation,
        difficulty: oldQuestion.difficulty,
        image_path: oldQuestion.image_path,
        status: oldQuestion.status || QuestionStatus.Published,
    });
    for (const option of old.options.filter(
        (item) => item.question_id === oldQuestion.id,
    ))
        optionByOld[`${oldQuestion.id}-${oldOptionCode(option)}`] = insert(
            "question_options",
            {
                question_id: questionId,
                code: oldOptionCode(option),
                text: option.text,
                position: oldOptionCode(option).charCodeAt(0) - 65,
            },
        );
    const paperId =
        papers[`unicamp-${oldExamById[oldQuestion.exam_id]}-first-phase-main`];
    const occurrenceSubjectId = subjectIdByName[oldQuestion.subject] || null;
    const occurrenceAreaId = occurrenceSubjectId
        ? target.exec("SELECT assessment_area_id FROM subjects WHERE id = ?", [
              occurrenceSubjectId,
          ])[0].values[0][0]
        : null;
    const occurrenceKey = `unicamp-${oldExamById[oldQuestion.exam_id]}-first-phase-${oldQuestion.number}`;
    const occurrenceId = insert("question_occurrences", {
        question_id: questionId,
        paper_id: paperId,
        subject_id: occurrenceSubjectId,
        assessment_area_id: occurrenceAreaId,
        occurrence_key: occurrenceKey,
        number: oldQuestion.number,
        original_number: oldQuestion.number,
        source_page: oldQuestion.source_page,
        status: oldQuestion.status || QuestionStatus.Published,
    });
    occurrenceByOldQuestion[oldQuestion.id] = occurrenceId;
    const answerId = insert("answer_keys", {
        question_occurrence_id: occurrenceId,
        answer_type: "choice",
        answer_value: oldQuestion.correct_answer,
        explanation: oldQuestion.explanation,
        is_automatically_gradable: 1,
        max_points: 1,
    });
    if (optionByOld[`${oldQuestion.id}-${oldQuestion.correct_answer}`])
        insert("answer_key_options", {
            answer_key_id: answerId,
            question_option_id:
                optionByOld[`${oldQuestion.id}-${oldQuestion.correct_answer}`],
        });
    const sourceUrl = oldQuestion.source_url;
    if (sourceUrl) {
        const sourceId =
            find("source_documents", "url", sourceUrl) ||
            insert("source_documents", {
                title: `Fonte da questão ${oldQuestion.number}`,
                url: sourceUrl,
                provider: "Comvest",
                kind: "exam",
                is_official: 1,
            });
        insert("question_sources", {
            question_occurrence_id: occurrenceId,
            source_document_id: sourceId,
            role: "exam",
        });
    }
    for (const relation of old.questionTopics.filter(
        (item) => item.question_id === oldQuestion.id,
    )) {
        const curriculumKey = `unicamp-${oldExamById[oldQuestion.exam_id]}`;
        const curriculumTopicId =
            curriculumTopicByEditionOld[curriculumKey]?.[relation.topic_id];
        if (curriculumTopicId)
            insert("question_topics", {
                question_occurrence_id: occurrenceId,
                curriculum_topic_id: curriculumTopicId,
                relation_type: QuestionTopicRelationType.Primary,
                confidence: 1,
            });
    }
}
for (const relation of old.relations)
    if (
        occurrenceByOldQuestion[relation.question_id] &&
        occurrenceByOldQuestion[relation.related_question_id]
    )
        insert("question_relations", {
            question_occurrence_id:
                occurrenceByOldQuestion[relation.question_id],
            related_occurrence_id:
                occurrenceByOldQuestion[relation.related_question_id],
            relation_type: relation.relation_type,
        });

for (const lesson of old.lessons) {
    const lessonId = insert("lessons", {
        slug: lesson.slug,
        content_key: `lesson:${lesson.slug}`,
        title: lesson.title,
        intro: lesson.intro,
        objective: lesson.intro || `Compreender ${lesson.title}.`,
        audience: "estudantes",
        level: "all",
        estimated_minutes: 3,
        editorial_version: "1.0.0",
        review_status: ReviewStatus.Review,
    });
    const roles = [
        [
            PedagogicalRole.Context,
            "Comece pelo contexto",
            "Antes da definição, observe a situação-problema e identifique o que precisa ser compreendido.",
        ],
        [
            PedagogicalRole.Analogy,
            "Uma analogia para começar",
            "Relacione este conteúdo a uma situação familiar antes de avançar para a linguagem formal.",
        ],
        [
            PedagogicalRole.Intuition,
            "Construa a intuição",
            "Explique com suas próprias palavras o que muda, o que permanece e qual é a ideia central.",
        ],
        [PedagogicalRole.Formalization, "Formalização", lesson.content],
        [
            PedagogicalRole.Limitation,
            "Limites da analogia",
            "Verifique onde a intuição ajuda e onde o modelo formal precisa prevalecer.",
        ],
        [
            PedagogicalRole.Example,
            "Exemplo resolvido",
            "Compare o raciocínio passo a passo com o conceito apresentado.",
        ],
        [
            PedagogicalRole.GuidedPractice,
            "Prática guiada",
            "Resolva uma primeira questão usando as pistas e o método indicado.",
        ],
        [
            PedagogicalRole.IndependentPractice,
            "Prática independente",
            "Tente uma questão sem consultar o roteiro e registre sua estratégia.",
        ],
        [
            PedagogicalRole.Application,
            "Aplicação",
            "Relacione o conceito a uma questão de vestibular ou a uma situação real.",
        ],
        [
            PedagogicalRole.Review,
            "Revisão",
            "Retome a ideia principal, a fórmula e o erro mais comum antes de seguir.",
        ],
    ];
    roles.forEach(([role, title, content], index) => {
        insert("lesson_sections", {
            lesson_id: lessonId,
            type: LessonSectionType.Theory,
            pedagogical_role: role,
            title,
            content,
            content_format: ContentFormat.Markdown,
            blocks_json: "[]",
            read_time_minutes: 1,
            position: index + 1,
        });
    });
    const curriculumTopicId =
        curriculumTopicByEditionOld["unicamp-2027"]?.[lesson.topic_id];
    if (curriculumTopicId)
        insert("lesson_topics", {
            lesson_id: lessonId,
            curriculum_topic_id: curriculumTopicId,
        });
}
const richLessonId = target.exec(
    "SELECT id FROM lessons WHERE slug = 'matematica.funcoes-graficos.aula-1'",
)[0]?.values[0]?.[0];
if (richLessonId)
    target.run(
        "UPDATE lesson_sections SET blocks_json = ?, content_format = ?, read_time_minutes = ? WHERE lesson_id = ? AND position = 1",
        [
            JSON.stringify([
                {
                    type: "callout",
                    severity: "info",
                    title: "Como estudar esta aula",
                    content:
                        "Leia o conceito, confira o exemplo e depois resolva uma questão relacionada. O progresso fica salvo neste dispositivo.",
                },
                {
                    type: "formula",
                    formula: "f(x)=ax+b",
                    caption:
                        "Uma forma linear simples para observar variação e intercepto.",
                },
                {
                    type: "summary",
                    title: "Resumo rápido",
                    content:
                        "Identifique domínio, imagem, variação e o significado dos pontos do gráfico antes de aplicar fórmulas.",
                },
            ]),
            ContentFormat.Markdown,
            4,
            richLessonId,
        ],
    );
for (const resource of old.resources) {
    const resourceId = insert("resources", {
        title: resource.title,
        url: resource.url,
        provider: resource.provider,
        kind: resource.kind,
        description: resource.description,
        is_free: resource.is_free,
        is_published: resource.is_published,
    });
    for (const relation of old.topicResources.filter(
        (item) => item.resource_id === resource.id,
    ))
        insert("resource_topics", {
            resource_id: resourceId,
            curriculum_topic_id:
                curriculumTopicByEditionOld["unicamp-2027"]?.[
                    relation.topic_id
                ] || null,
        });
}

const campi = {
    campinas: insert("campuses", {
        university_id: university.unicamp,
        name: "Campinas",
        city: "Campinas",
        state: "SP",
    }),
    saoPaulo: insert("campuses", {
        university_id: university.usp,
        name: "São Paulo",
        city: "São Paulo",
        state: "SP",
    }),
};
const degreePrograms = {
    medicinaUnicamp: insert("degree_programs", {
        university_id: university.unicamp,
        campus_id: campi.campinas,
        slug: "medicina-unicamp",
        name: "Medicina",
    }),
    medicinaUsp: insert("degree_programs", {
        university_id: university.usp,
        campus_id: campi.saoPaulo,
        slug: "medicina-usp",
        name: "Medicina",
    }),
};
const modalities = {
    ampla: insert("admission_modalities", {
        slug: "ampla-concorrencia",
        name: "Ampla concorrência",
    }),
    cotas: insert("admission_modalities", { slug: "cotas", name: "Cotas" }),
};
for (const [editionKey, degreeProgramId] of [
    ["unicamp-2027", degreePrograms.medicinaUnicamp],
    ["fuvest-2027", degreePrograms.medicinaUsp],
]) {
    const offering = insert("course_offerings", {
        edition_id: editions[editionKey],
        degree_program_id: degreeProgramId,
        modality_id: modalities.ampla,
    });
    for (const stageId of Object.entries(stages)
        .filter(([key]) => key.startsWith(`${editionKey}-`))
        .map(([, id]) => id))
        insert("course_stage_requirements", {
            course_offering_id: offering,
            stage_id: stageId,
            paper_id: null,
        });
}

// Camada editorial de aprendizagem: cursos, mapas e planos reutilizam o conteúdo acima.
const editorialTopicIds = old.topics
    .map((topic) => topicIdByOld[topic.id])
    .filter(Boolean);
const assessmentSetIds = {};
const unicampQuestionOccurrences =
    target
        .exec(
            "SELECT qo.id FROM question_occurrences qo JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id WHERE e.slug LIKE 'unicamp-%' ORDER BY e.year DESC, qo.number",
        )[0]
        ?.values.flat() || [];
assessmentSetIds.unicampList = insert("assessment_sets", {
    slug: "lista-unicamp-questoes-catalogadas",
    title: "Lista de questões catalogadas da Unicamp",
    description:
        "Prática selecionada a partir das questões já revisadas na base.",
    kind: AssessmentSetKind.QuestionSet,
    admission_process_id: admissionProcess.unicamp,
    duration_minutes: 60,
});
unicampQuestionOccurrences.forEach((questionOccurrenceId, index) => {
    insert("assessment_set_items", {
        assessment_set_id: assessmentSetIds.unicampList,
        position: index + 1,
        item_type: AssessmentItemType.Question,
        question_occurrence_id: questionOccurrenceId,
        points: 1,
    });
});
for (const topic of old.topics.filter(
    (item) => item.parent_id && topicIdByOld[item.parent_id],
)) {
    insert("topic_relations", {
        topic_id: topicIdByOld[item.parent_id],
        related_topic_id: topicIdByOld[topic.id],
        relation_type: TopicRelationType.Parent,
    });
}
if (editorialTopicIds.length >= 3) {
    insert("topic_relations", {
        topic_id: editorialTopicIds[0],
        related_topic_id: editorialTopicIds[1],
        relation_type: TopicRelationType.Similar,
        note: "Conteúdos que podem ser estudados em sequência.",
    });
    insert("topic_relations", {
        topic_id: editorialTopicIds[1],
        related_topic_id: editorialTopicIds[2],
        relation_type: TopicRelationType.Prerequisite,
    });
}

const learningCourse = {
    foundations: insert("learning_courses", {
        slug: "fundamentos-para-vestibulares",
        title: "Fundamentos para Vestibulares",
        description:
            "Trilha geral para construir uma base sólida antes de avançar para provas específicas.",
        level: "basic",
        course_type: LearningCourseType.General,
        estimated_minutes: 240,
    }),
    unicamp: insert("learning_courses", {
        slug: "preparacao-unicamp-2027",
        title: "Preparação Unicamp 2027",
        description:
            "Uma trilha orientada pelos tópicos e pelo estilo de cobrança da Unicamp.",
        level: "intermediate",
        course_type: LearningCourseType.Specific,
        estimated_minutes: 360,
    }),
};
const moduleBySlug = {};
function addLearningModule(courseId, slug, title, description, position) {
    const id = insert("learning_course_modules", {
        learning_course_id: courseId,
        slug,
        title,
        description,
        position,
    });
    moduleBySlug[`${courseId}:${slug}`] = id;
    return id;
}
const foundationModule = addLearningModule(
    learningCourse.foundations,
    "base",
    "Comece pela base",
    "Conceitos essenciais para interpretar problemas e organizar o raciocínio.",
    1,
);
const functionsModule = addLearningModule(
    learningCourse.foundations,
    "functions",
    "Funções e gráficos",
    "Leitura de funções, gráficos e modelos.",
    2,
);
const unicampModule = addLearningModule(
    learningCourse.unicamp,
    "unicamp-core",
    "Núcleo Unicamp",
    "Conteúdos prioritários para o Vestibular Unicamp 2027.",
    1,
);
const unicampPracticeModule = addLearningModule(
    learningCourse.unicamp,
    "practice",
    "Pratique e revise",
    "Exercícios selecionados e retomadas dos pontos mais importantes.",
    2,
);

const lessonBySlug = Object.fromEntries(
    target
        .exec("SELECT id, slug FROM lessons")[0]
        ?.values.map(([id, slug]) => [slug, id]) || [],
);
const questionIds =
    target
        .exec("SELECT id FROM question_occurrences ORDER BY id")[0]
        ?.values.flat() || [];
function addCourseItem(
    moduleId,
    itemType,
    title,
    description,
    position,
    extras = {},
) {
    return insert("learning_course_items", {
        module_id: moduleId,
        item_type: itemType,
        title,
        description,
        position,
        lesson_id: extras.lesson_id || null,
        question_occurrence_id: extras.question_occurrence_id || null,
        assessment_set_id: extras.assessment_set_id || null,
        duration_minutes: extras.duration_minutes || 15,
        is_required: extras.is_required ?? 1,
    });
}
addCourseItem(
    foundationModule,
    LearningCourseItemType.Lesson,
    "Leitura e modelagem antes da fórmula",
    "Entenda como transformar um enunciado em um modelo matemático.",
    1,
    {
        lesson_id: lessonBySlug["matematica.funcoes-graficos.aula-1"],
        duration_minutes: 20,
    },
);
addCourseItem(
    foundationModule,
    LearningCourseItemType.Practice,
    "Pratique a base",
    "Resolva questões para verificar se os conceitos fundamentais estão firmes.",
    2,
    { question_occurrence_id: questionIds[0], duration_minutes: 15 },
);
addCourseItem(
    functionsModule,
    LearningCourseItemType.Lesson,
    "Funções e gráficos",
    "Estude domínio, imagem, variação e interpretação de gráficos.",
    1,
    {
        lesson_id: lessonBySlug["matematica.funcoes-graficos.aula-1"],
        duration_minutes: 25,
    },
);
addCourseItem(
    functionsModule,
    LearningCourseItemType.Review,
    "Revisão rápida de funções",
    "Retome os conceitos centrais antes de avançar.",
    2,
    { duration_minutes: 10 },
);
addCourseItem(
    unicampModule,
    LearningCourseItemType.Lesson,
    "Mecânica: modelo antes da fórmula",
    "Uma aula de Física com foco na leitura de situações-problema.",
    1,
    { lesson_id: lessonBySlug["fisica.mecanica.aula-1"], duration_minutes: 20 },
);
addCourseItem(
    unicampModule,
    LearningCourseItemType.Lesson,
    "Leitura contextual de textos",
    "Estratégias para compreender textos e comandos de prova.",
    2,
    {
        lesson_id: lessonBySlug["lingua-portuguesa.texto-funcionamento.aula-1"],
        duration_minutes: 20,
    },
);
addCourseItem(
    unicampPracticeModule,
    LearningCourseItemType.QuestionSet,
    "Questões da 1ª fase",
    "Treine com questões já catalogadas na base.",
    1,
    { assessment_set_id: assessmentSetIds.unicampList, duration_minutes: 20 },
);
addCourseItem(
    unicampPracticeModule,
    LearningCourseItemType.Review,
    "Revisão do seu desempenho",
    "Volte às questões erradas e registre os pontos para revisar.",
    2,
    { duration_minutes: 15 },
);

for (const topicId of editorialTopicIds.slice(0, 12))
    insert("learning_course_topics", {
        learning_course_id: learningCourse.foundations,
        topic_id: topicId,
        is_primary: 1,
    });
for (const topicId of editorialTopicIds.slice(0, 18))
    insert("learning_course_topics", {
        learning_course_id: learningCourse.unicamp,
        topic_id: topicId,
        is_primary: 1,
    });
for (const editionId of [
    editions["unicamp-2027"],
    editions["unicamp-2026"],
].filter(Boolean))
    insert("learning_course_targets", {
        learning_course_id: learningCourse.unicamp,
        admission_process_id: null,
        edition_id: editionId,
    });
for (const processId of Object.values(admissionProcess))
    insert("learning_course_targets", {
        learning_course_id: learningCourse.foundations,
        admission_process_id: processId,
        edition_id: null,
    });

const mapId = insert("learning_maps", {
    slug: "mapa-unicamp-2027",
    title: "Mapa de domínio Unicamp 2027",
    description:
        "Visualize os tópicos, pré-requisitos e próximos passos da preparação.",
    edition_id: editions["unicamp-2027"],
    admission_process_id: admissionProcess.unicamp,
    learning_course_id: learningCourse.unicamp,
});
const mapTopicIds = Object.values(
    curriculumTopicByEditionOld["unicamp-2027"] || {},
).slice(0, 12);
mapTopicIds.forEach((curriculumTopicId, index) => {
    insert("learning_map_topics", {
        map_id: mapId,
        curriculum_topic_id: curriculumTopicId,
        position: index + 1,
        is_milestone: index === 0 || index === mapTopicIds.length - 1 ? 1 : 0,
    });
});
for (let index = 1; index < mapTopicIds.length; index += 1)
    insert("learning_map_edges", {
        map_id: mapId,
        from_topic_id: mapTopicIds[index - 1],
        to_topic_id: mapTopicIds[index],
        relation_type: "prerequisite",
    });

const planId = insert("study_plans", {
    slug: "trilha-30-dias-unicamp-2027",
    title: "Trilha de 30 dias para a Unicamp",
    objective: "Criar ritmo de estudo e revisar os tópicos essenciais.",
    description:
        "Um plano editorial curto para começar com teoria, prática e revisão.",
    duration_days: 30,
    learning_course_id: learningCourse.unicamp,
    map_id: mapId,
    edition_id: editions["unicamp-2027"],
});
const planSteps = [
    [
        "Conheça o mapa",
        "Navegue pelos tópicos e identifique os pré-requisitos.",
        mapTopicIds[0],
        unicampModule,
        null,
        15,
    ],
    [
        "Estude a teoria",
        "Leia as aulas do núcleo de preparação.",
        mapTopicIds[1] || mapTopicIds[0],
        unicampModule,
        null,
        30,
    ],
    [
        "Pratique questões",
        "Resolva uma seleção da 1ª fase.",
        mapTopicIds[2] || mapTopicIds[0],
        unicampPracticeModule,
        null,
        30,
    ],
    [
        "Faça uma revisão",
        "Retome erros e registre o que precisa voltar a estudar.",
        mapTopicIds[3] || mapTopicIds[0],
        unicampPracticeModule,
        null,
        20,
    ],
];
planSteps.forEach(
    (
        [
            title,
            description,
            curriculumTopicId,
            moduleId,
            itemId,
            estimatedMinutes,
        ],
        index,
    ) => {
        insert("study_plan_steps", {
            study_plan_id: planId,
            position: index + 1,
            title,
            description,
            curriculum_topic_id: curriculumTopicId,
            module_id: moduleId,
            item_id: itemId,
            estimated_minutes: estimatedMinutes,
            is_required: 1,
        });
    },
);

for (const stageId of Object.values(stages))
    insert("scoring_rules", {
        stage_id: stageId,
        mode: "raw_correct",
        points_per_correct: 1,
        tri_enabled: 0,
        metadata_json: JSON.stringify({ automatic_correction: true }),
    });
insert("content_releases", {
    version: "editorial-v2",
    schema_version: 4,
    generated_at: now,
    notes: "Modelo editorial com progressão pedagógica, cursos, mapas, planos e relações de tópicos.",
});

target.run("DROP TABLE IF EXISTS schema_migrations");
const binary = target.export();
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(binary));
console.log(
    `Snapshot multi-exame exportado: ${outputPath} (${binary.byteLength} bytes)`,
);
