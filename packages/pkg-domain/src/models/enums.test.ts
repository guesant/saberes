import { describe, expect, it } from "vitest";
import {
  AdmissionProcessCode,
  FsrsRating,
  OrganizerCode,
  ReviewTargetType,
  UniversityCode,
} from "./domain.enums";

describe("tokens estáveis do domínio", () => {
  it("mantém os códigos editoriais compatíveis com o SQLite", () => {
    expect(AdmissionProcessCode.Enem).toBe("enem");

    expect(AdmissionProcessCode.Fuvest).toBe("fuvest");

    expect(AdmissionProcessCode.Unicamp).toBe("unicamp");

    expect(OrganizerCode.Comvest).toBe("comvest");

    expect(UniversityCode.Unicamp).toBe("unicamp");
  });

  it("mantém os discriminadores usados pelo progresso local", () => {
    expect(ReviewTargetType.Question).toBe("question");

    expect(FsrsRating.Again).toBe("again");

    expect(FsrsRating.Easy).toBe("easy");
  });
});
