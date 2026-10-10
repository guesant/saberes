-- migrate:up
CREATE UNIQUE INDEX idx_course_exam_criteria_priority_order
  ON course_exam_criteria (course_offering_id, priority_order)
  WHERE criterion_kind = 'priority';

-- migrate:down
DROP INDEX IF EXISTS idx_course_exam_criteria_priority_order;
