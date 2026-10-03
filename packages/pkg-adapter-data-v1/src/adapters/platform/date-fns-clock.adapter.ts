import type { ClockPort } from "@guesant/saberes-application";

export class DateFnsClockAdapter implements ClockPort {
  execute() {
    return new Date();
  }
}
