import { normalizeWorkExperiences } from "lib/redux/work-experience";

describe("work experience helpers", () => {
  test("backfills companyUrl when loading old work experience data", () => {
    const workExperiences = [{ company: "Example Co" }] as any;

    normalizeWorkExperiences(workExperiences);

    expect(workExperiences[0].companyUrl).toBe("");
  });
});
