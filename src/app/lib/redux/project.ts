import type { ResumeProject } from "lib/redux/types";

export const normalizeProjects = (projects: ResumeProject[]) => {
  for (const project of projects) {
    project.projectUrl = project.projectUrl ?? "";
    project.summary = project.summary ?? "";
  }
};
