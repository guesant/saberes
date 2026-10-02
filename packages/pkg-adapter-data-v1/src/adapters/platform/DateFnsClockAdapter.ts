import { format } from "date-fns";
import type { ClockPort } from "@guesant/saberes-core";

export class DateFnsClockAdapter implements ClockPort {
    now() {
        return new Date();
    }

    dateKey(date = this.now()) {
        return format(date, "yyyy-MM-dd");
    }
}
