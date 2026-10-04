import type { ReviewDatabaseEvent } from "./review-database-event.interface";

export interface ReviewEventInput extends Omit<ReviewDatabaseEvent, "id"> {
  id?: string;
}
