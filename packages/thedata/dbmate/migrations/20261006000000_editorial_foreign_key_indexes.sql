-- migrate:up
CREATE INDEX admission_processes_organizer_id ON admission_processes (organizer_id);

CREATE INDEX admission_processes_university_id ON admission_processes (university_id);

CREATE INDEX papers_source_document_id ON papers (source_document_id);

CREATE INDEX paper_versions_source_document_id ON paper_versions (source_document_id);

CREATE INDEX paper_versions_language_id ON paper_versions (language_id);

CREATE INDEX subjects_assessment_area_id ON subjects (assessment_area_id);

CREATE INDEX paper_subjects_assessment_area_id ON paper_subjects (assessment_area_id);

CREATE INDEX paper_subjects_subject_id ON paper_subjects (subject_id);

CREATE INDEX campuses_university_id ON campuses (university_id);

CREATE INDEX degree_programs_campus_id ON degree_programs (campus_id);

CREATE INDEX degree_programs_university_id ON degree_programs (university_id);

CREATE INDEX course_offerings_modality_id ON course_offerings (modality_id);

CREATE INDEX course_offerings_degree_program_id ON course_offerings (degree_program_id);

CREATE INDEX course_stage_requirements_paper_id ON course_stage_requirements (paper_id);

CREATE INDEX course_stage_requirements_stage_id ON course_stage_requirements (stage_id);

CREATE INDEX question_occurrences_source_document_id ON question_occurrences (source_document_id);

CREATE INDEX question_occurrences_assessment_area_id ON question_occurrences (assessment_area_id);

CREATE INDEX question_occurrences_subject_id ON question_occurrences (subject_id);

CREATE INDEX question_occurrences_paper_version_id ON question_occurrences (paper_version_id);

CREATE INDEX question_occurrences_question_id ON question_occurrences (question_id);

CREATE INDEX answer_keys_question_part_id ON answer_keys (question_part_id);

CREATE INDEX answer_keys_question_occurrence_id ON answer_keys (question_occurrence_id);

CREATE INDEX answer_key_options_question_option_id ON answer_key_options (question_option_id);

CREATE INDEX grading_rubrics_question_occurrence_id ON grading_rubrics (question_occurrence_id);

CREATE INDEX question_sources_source_document_id ON question_sources (source_document_id);

CREATE INDEX curricula_source_document_id ON curricula (source_document_id);

CREATE INDEX topics_parent_id ON topics (parent_id);

CREATE INDEX topic_subjects_subject_id ON topic_subjects (subject_id);

CREATE INDEX curriculum_topics_parent_id ON curriculum_topics (parent_id);

CREATE INDEX curriculum_topics_topic_id ON curriculum_topics (topic_id);

CREATE INDEX topic_relations_related_topic_id ON topic_relations (related_topic_id);

CREATE INDEX question_topics_curriculum_topic_id ON question_topics (curriculum_topic_id);

CREATE INDEX lesson_sections_lesson_id ON lesson_sections (lesson_id);

CREATE INDEX lesson_topics_curriculum_topic_id ON lesson_topics (curriculum_topic_id);

CREATE INDEX lesson_topics_topic_id ON lesson_topics (topic_id);

CREATE INDEX resources_source_document_id ON resources (source_document_id);

CREATE INDEX resource_topics_curriculum_topic_id ON resource_topics (curriculum_topic_id);

CREATE INDEX resource_topics_topic_id ON resource_topics (topic_id);

CREATE INDEX assessment_sets_subject_id ON assessment_sets (subject_id);

CREATE INDEX assessment_sets_admission_process_id ON assessment_sets (admission_process_id);

CREATE INDEX assessment_sets_edition_id ON assessment_sets (edition_id);

CREATE INDEX assessment_set_items_lesson_id ON assessment_set_items (lesson_id);

CREATE INDEX assessment_set_items_question_occurrence_id ON assessment_set_items (question_occurrence_id);

CREATE INDEX assessment_set_items_question_id ON assessment_set_items (question_id);

CREATE INDEX learning_course_items_assessment_set_id ON learning_course_items (assessment_set_id);

CREATE INDEX learning_course_items_question_occurrence_id ON learning_course_items (question_occurrence_id);

CREATE INDEX learning_course_items_lesson_id ON learning_course_items (lesson_id);

CREATE INDEX learning_course_items_module_id ON learning_course_items (module_id);

CREATE INDEX learning_course_items_question_id ON learning_course_items (question_id);

CREATE INDEX learning_course_topics_topic_id ON learning_course_topics (topic_id);

CREATE INDEX learning_course_targets_edition_id ON learning_course_targets (edition_id);

CREATE INDEX learning_course_targets_admission_process_id ON learning_course_targets (admission_process_id);

CREATE INDEX learning_maps_learning_course_id ON learning_maps (learning_course_id);

CREATE INDEX learning_maps_admission_process_id ON learning_maps (admission_process_id);

CREATE INDEX learning_maps_edition_id ON learning_maps (edition_id);

CREATE INDEX learning_map_topics_curriculum_topic_id ON learning_map_topics (curriculum_topic_id);

CREATE INDEX learning_map_edges_to_topic_id ON learning_map_edges (to_topic_id);

CREATE INDEX learning_map_edges_from_topic_id ON learning_map_edges (from_topic_id);

CREATE INDEX study_plans_edition_id ON study_plans (edition_id);

CREATE INDEX study_plans_map_id ON study_plans (map_id);

CREATE INDEX study_plans_learning_course_id ON study_plans (learning_course_id);

CREATE INDEX study_plan_steps_item_id ON study_plan_steps (item_id);

CREATE INDEX study_plan_steps_module_id ON study_plan_steps (module_id);

CREATE INDEX study_plan_steps_curriculum_topic_id ON study_plan_steps (curriculum_topic_id);

CREATE INDEX question_relations_related_occurrence_id ON question_relations (related_occurrence_id);

CREATE INDEX essay_prompts_source_document_id ON essay_prompts (source_document_id);

CREATE INDEX essay_prompts_stage_id ON essay_prompts (stage_id);

CREATE INDEX essay_evaluations_essay_prompt_id ON essay_evaluations (essay_prompt_id);

CREATE INDEX scoring_rules_paper_id ON scoring_rules (paper_id);

CREATE INDEX scoring_rules_stage_id ON scoring_rules (stage_id);

CREATE INDEX canonical_question_topics_topic_id ON canonical_question_topics (topic_id);

CREATE INDEX stimuli_source_document_id ON stimuli (source_document_id);

CREATE INDEX content_assets_source_document_id ON content_assets (source_document_id);

CREATE INDEX question_stimuli_stimulus_id ON question_stimuli (stimulus_id);

CREATE INDEX stimulus_assets_asset_id ON stimulus_assets (asset_id);

CREATE INDEX question_assets_asset_id ON question_assets (asset_id);

CREATE INDEX question_occurrence_options_question_option_id ON question_occurrence_options (question_option_id);

CREATE INDEX canonical_answer_keys_source_document_id ON canonical_answer_keys (source_document_id);

CREATE INDEX canonical_answer_keys_question_part_id ON canonical_answer_keys (question_part_id);

CREATE INDEX canonical_answer_keys_occurrence_id ON canonical_answer_keys (occurrence_id);

CREATE INDEX canonical_answer_key_options_question_option_id ON canonical_answer_key_options (question_option_id);

-- migrate:down
DROP INDEX IF EXISTS canonical_answer_key_options_question_option_id;

DROP INDEX IF EXISTS canonical_answer_keys_occurrence_id;

DROP INDEX IF EXISTS canonical_answer_keys_question_part_id;

DROP INDEX IF EXISTS canonical_answer_keys_source_document_id;

DROP INDEX IF EXISTS question_occurrence_options_question_option_id;

DROP INDEX IF EXISTS question_assets_asset_id;

DROP INDEX IF EXISTS stimulus_assets_asset_id;

DROP INDEX IF EXISTS question_stimuli_stimulus_id;

DROP INDEX IF EXISTS content_assets_source_document_id;

DROP INDEX IF EXISTS stimuli_source_document_id;

DROP INDEX IF EXISTS canonical_question_topics_topic_id;

DROP INDEX IF EXISTS scoring_rules_stage_id;

DROP INDEX IF EXISTS scoring_rules_paper_id;

DROP INDEX IF EXISTS essay_evaluations_essay_prompt_id;

DROP INDEX IF EXISTS essay_prompts_stage_id;

DROP INDEX IF EXISTS essay_prompts_source_document_id;

DROP INDEX IF EXISTS question_relations_related_occurrence_id;

DROP INDEX IF EXISTS study_plan_steps_curriculum_topic_id;

DROP INDEX IF EXISTS study_plan_steps_module_id;

DROP INDEX IF EXISTS study_plan_steps_item_id;

DROP INDEX IF EXISTS study_plans_learning_course_id;

DROP INDEX IF EXISTS study_plans_map_id;

DROP INDEX IF EXISTS study_plans_edition_id;

DROP INDEX IF EXISTS learning_map_edges_from_topic_id;

DROP INDEX IF EXISTS learning_map_edges_to_topic_id;

DROP INDEX IF EXISTS learning_map_topics_curriculum_topic_id;

DROP INDEX IF EXISTS learning_maps_edition_id;

DROP INDEX IF EXISTS learning_maps_admission_process_id;

DROP INDEX IF EXISTS learning_maps_learning_course_id;

DROP INDEX IF EXISTS learning_course_targets_admission_process_id;

DROP INDEX IF EXISTS learning_course_targets_edition_id;

DROP INDEX IF EXISTS learning_course_topics_topic_id;

DROP INDEX IF EXISTS learning_course_items_question_id;

DROP INDEX IF EXISTS learning_course_items_module_id;

DROP INDEX IF EXISTS learning_course_items_lesson_id;

DROP INDEX IF EXISTS learning_course_items_question_occurrence_id;

DROP INDEX IF EXISTS learning_course_items_assessment_set_id;

DROP INDEX IF EXISTS assessment_set_items_question_id;

DROP INDEX IF EXISTS assessment_set_items_question_occurrence_id;

DROP INDEX IF EXISTS assessment_set_items_lesson_id;

DROP INDEX IF EXISTS assessment_sets_edition_id;

DROP INDEX IF EXISTS assessment_sets_admission_process_id;

DROP INDEX IF EXISTS assessment_sets_subject_id;

DROP INDEX IF EXISTS resource_topics_topic_id;

DROP INDEX IF EXISTS resource_topics_curriculum_topic_id;

DROP INDEX IF EXISTS resources_source_document_id;

DROP INDEX IF EXISTS lesson_topics_topic_id;

DROP INDEX IF EXISTS lesson_topics_curriculum_topic_id;

DROP INDEX IF EXISTS lesson_sections_lesson_id;

DROP INDEX IF EXISTS question_topics_curriculum_topic_id;

DROP INDEX IF EXISTS topic_relations_related_topic_id;

DROP INDEX IF EXISTS curriculum_topics_topic_id;

DROP INDEX IF EXISTS curriculum_topics_parent_id;

DROP INDEX IF EXISTS topics_parent_id;

DROP INDEX IF EXISTS curricula_source_document_id;

DROP INDEX IF EXISTS question_sources_source_document_id;

DROP INDEX IF EXISTS grading_rubrics_question_occurrence_id;

DROP INDEX IF EXISTS answer_key_options_question_option_id;

DROP INDEX IF EXISTS answer_keys_question_occurrence_id;

DROP INDEX IF EXISTS answer_keys_question_part_id;

DROP INDEX IF EXISTS question_occurrences_question_id;

DROP INDEX IF EXISTS question_occurrences_paper_version_id;

DROP INDEX IF EXISTS question_occurrences_subject_id;

DROP INDEX IF EXISTS question_occurrences_assessment_area_id;

DROP INDEX IF EXISTS question_occurrences_source_document_id;

DROP INDEX IF EXISTS course_stage_requirements_stage_id;

DROP INDEX IF EXISTS course_stage_requirements_paper_id;

DROP INDEX IF EXISTS course_offerings_degree_program_id;

DROP INDEX IF EXISTS course_offerings_modality_id;

DROP INDEX IF EXISTS degree_programs_university_id;

DROP INDEX IF EXISTS degree_programs_campus_id;

DROP INDEX IF EXISTS campuses_university_id;

DROP INDEX IF EXISTS paper_subjects_subject_id;

DROP INDEX IF EXISTS paper_subjects_assessment_area_id;

DROP INDEX IF EXISTS subjects_assessment_area_id;

DROP INDEX IF EXISTS paper_versions_language_id;

DROP INDEX IF EXISTS paper_versions_source_document_id;

DROP INDEX IF EXISTS papers_source_document_id;

DROP INDEX IF EXISTS admission_processes_university_id;

DROP INDEX IF EXISTS admission_processes_organizer_id;
