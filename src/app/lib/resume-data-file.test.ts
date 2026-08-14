import {
  createResumeDataFile,
  getResumeDataFileName,
  parseResumeDataFile,
  stringifyResumeDataFile,
} from "lib/resume-data-file";
import { initialResumeState } from "lib/redux/resume-state";
import { initialSettings } from "lib/redux/settings-state";

describe("resume data file", () => {
  test("creates an editable data file with resume and settings", () => {
    const resume = {
      ...initialResumeState,
      profile: { ...initialResumeState.profile, name: "Jane Doe" },
    };
    const settings = {
      ...initialSettings,
      documentSize: "A4",
    };

    const dataFile = createResumeDataFile(resume, settings);

    expect(dataFile.app).toBe("open-resume");
    expect(dataFile.version).toBe(1);
    expect(dataFile.resume.profile.name).toBe("Jane Doe");
    expect(dataFile.settings.documentSize).toBe("A4");
    expect(new Date(dataFile.exportedAt).toString()).not.toBe("Invalid Date");
  });

  test("parses an exported data file", () => {
    const resume = {
      ...initialResumeState,
      profile: {
        ...initialResumeState.profile,
        name: "Jane Doe",
        url: "https://example.com",
        urls: ["https://example.com"],
      },
    };
    const settings = {
      ...initialSettings,
      themeColor: "#111111",
    };

    const parsed = parseResumeDataFile(
      stringifyResumeDataFile(resume, settings)
    );

    expect(parsed.resume.profile.name).toBe("Jane Doe");
    expect(parsed.resume.profile.urls).toEqual(["https://example.com"]);
    expect(parsed.settings.themeColor).toBe("#111111");
  });

  test("fills missing fields in older resume data", () => {
    const parsed = parseResumeDataFile(
      JSON.stringify({
        resume: {
          profile: {
            name: "Jane Doe",
            email: "",
            phone: "",
            url: "https://example.com",
            summary: "",
            location: "",
          },
          workExperiences: [
            {
              company: "Acme",
              jobTitle: "Engineer",
              date: "",
              descriptions: [],
            },
          ],
          educations: [],
          projects: [
            {
              project: "Project",
              date: "",
              descriptions: [],
            },
          ],
          skills: {
            featuredSkills: [{ skill: "TypeScript" }],
            descriptions: [],
          },
          custom: {
            descriptions: [],
          },
        },
        settings: {
          formsOrder: ["projects"],
        },
      })
    );

    expect(parsed.resume.profile.urls).toEqual(["https://example.com"]);
    expect(parsed.resume.workExperiences[0].companyUrl).toBe("");
    expect(parsed.resume.workExperiences[0].companyDescription).toBe("");
    expect(parsed.resume.workExperiences[0].summary).toBe("");
    expect(parsed.resume.projects[0].projectUrl).toBe("");
    expect(parsed.resume.projects[0].summary).toBe("");
    expect(parsed.resume.skills.featuredSkills[0].rating).toBe(4);
    expect(parsed.settings.formsOrder).toEqual([
      "projects",
      "workExperiences",
      "educations",
      "skills",
      "custom",
    ]);
  });

  test("rejects files without resume data", () => {
    expect(() => parseResumeDataFile(JSON.stringify({ settings: {} }))).toThrow(
      "resume data"
    );
  });

  test("creates a safe file name", () => {
    expect(getResumeDataFileName("Jane / Doe Resume")).toBe(
      "Jane-Doe-Resume-open-resume.json"
    );
    expect(getResumeDataFileName("")).toBe("resume-open-resume.json");
  });
});
