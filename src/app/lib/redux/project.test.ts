import { normalizeProjects } from "lib/redux/project";

describe("project helpers", () => {
  test("backfills new project fields when loading old project data", () => {
    const projects = [{ project: "OpenResume" }] as any;

    normalizeProjects(projects);

    expect(projects[0].projectUrl).toBe("");
    expect(projects[0].summary).toBe("");
  });
});
