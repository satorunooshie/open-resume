import type { ResumeWorkExperience } from "lib/redux/types";

export const normalizeWorkExperiences = (
  workExperiences: ResumeWorkExperience[]
) => {
  for (const workExperience of workExperiences) {
    workExperience.companyUrl = workExperience.companyUrl ?? "";
  }
};
