import {
  getAllFontFamiliesToLoad,
  getCJKWrapUnits,
  getResumePDFTextFontFamily,
} from "components/fonts/lib";
import type { Resume } from "lib/redux/types";

const createResume = (name = ""): Resume => ({
  profile: {
    name,
    summary: "",
    email: "",
    phone: "",
    location: "",
    url: "",
    urls: [],
  },
  workExperiences: [],
  educations: [],
  projects: [],
  skills: { featuredSkills: [], descriptions: [] },
  custom: { descriptions: [] },
});

describe("font helpers", () => {
  test("keeps the selected English font for ASCII resume text", () => {
    expect(getResumePDFTextFontFamily(createResume("Jane Doe"), "Roboto")).toBe(
      "Roboto"
    );
  });

  test("uses a CJK font for Japanese resume text with an English font selected", () => {
    expect(
      getResumePDFTextFontFamily(createResume("山田 太郎"), "Roboto")
    ).toBe("NotoSansSC");
  });

  test("uses a CJK font for Japanese headings", () => {
    const settings = {
      formToHeading: {
        workExperiences: "職務経歴",
      },
    };

    expect(getResumePDFTextFontFamily(createResume(), "Roboto", settings)).toBe(
      "NotoSansSC"
    );
  });

  test("loads the CJK font for Japanese browser languages", () => {
    Object.defineProperty(navigator, "languages", {
      value: ["ja-JP", "en-US"],
      configurable: true,
    });

    expect(getAllFontFamiliesToLoad()).toContain("NotoSansSC");
  });

  test("keeps Japanese punctuation with the previous wrap unit", () => {
    expect(getCJKWrapUnits("これはテストです。")).toEqual([
      "こ",
      "れ",
      "は",
      "テ",
      "ス",
      "ト",
      "で",
      "す。",
    ]);

    expect(getCJKWrapUnits("改善し、確認する。")).toEqual([
      "改",
      "善",
      "し、",
      "確",
      "認",
      "す",
      "る。",
    ]);
  });

  test("keeps opening brackets with the next wrap unit", () => {
    expect(getCJKWrapUnits("「重要」です。")).toEqual([
      "「重",
      "要」",
      "で",
      "す。",
    ]);
  });

  test("keeps Latin words together in CJK wrap units", () => {
    expect(getCJKWrapUnits("Reactを改善。")).toEqual([
      "React",
      "を",
      "改",
      "善。",
    ]);
  });
});
