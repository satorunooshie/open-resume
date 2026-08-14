import { deepMerge } from "lib/deep-merge";
import {
  initialEducation,
  initialFeaturedSkill,
  initialProject,
  initialResumeState,
  initialWorkExperience,
} from "lib/redux/resume-state";
import { type Settings, type ShowForm } from "lib/redux/settingsSlice";
import { initialSettings } from "lib/redux/settings-state";
import { normalizeProfileUrls } from "lib/redux/profile";
import { normalizeProjects } from "lib/redux/project";
import { normalizeWorkExperiences } from "lib/redux/work-experience";
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeProject,
  ResumeWorkExperience,
} from "lib/redux/types";

const RESUME_DATA_FILE_APP = "open-resume";
const RESUME_DATA_FILE_VERSION = 1;

export interface ResumeDataFile {
  app: typeof RESUME_DATA_FILE_APP;
  version: typeof RESUME_DATA_FILE_VERSION;
  exportedAt: string;
  resume: Resume;
  settings: Settings;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const isResumeLike = (value: unknown): value is Record<string, unknown> => {
  return (
    isRecord(value) &&
    isRecord(value.profile) &&
    Array.isArray(value.workExperiences) &&
    Array.isArray(value.educations) &&
    Array.isArray(value.projects) &&
    isRecord(value.skills) &&
    isRecord(value.custom)
  );
};

const mergeArrayItems = <T extends object>(
  initialItem: T,
  items: unknown
): T[] => {
  if (!Array.isArray(items)) return [];
  return items.map((item) =>
    isRecord(item)
      ? (deepMerge(initialItem, item) as T)
      : (deepMerge(initialItem, {}) as T)
  );
};

const getResumeCandidate = (value: unknown) => {
  if (isRecord(value) && isResumeLike(value.resume)) return value.resume;
  if (isResumeLike(value)) return value;
  return undefined;
};

const getSettingsCandidate = (value: unknown): Record<string, unknown> => {
  return isRecord(value) && isRecord(value.settings) ? value.settings : {};
};

const mergeResumeWithInitialState = (
  source: Record<string, unknown>
): Resume => {
  const resume = deepMerge(initialResumeState, source) as Resume;

  resume.workExperiences = mergeArrayItems<ResumeWorkExperience>(
    initialWorkExperience,
    source.workExperiences
  );
  resume.educations = mergeArrayItems<ResumeEducation>(
    initialEducation,
    source.educations
  );
  resume.projects = mergeArrayItems<ResumeProject>(
    initialProject,
    source.projects
  );
  resume.skills.featuredSkills = mergeArrayItems<FeaturedSkill>(
    initialFeaturedSkill,
    isRecord(source.skills) ? source.skills.featuredSkills : undefined
  );

  normalizeProfileUrls(resume.profile);
  normalizeWorkExperiences(resume.workExperiences);
  normalizeProjects(resume.projects);

  return resume;
};

const mergeSettingsWithInitialState = (
  source: Record<string, unknown>
): Settings => {
  const settings = deepMerge(initialSettings, source) as Settings;
  const validForms = new Set<ShowForm>(initialSettings.formsOrder);
  const importedFormsOrder = settings.formsOrder.filter((form) =>
    validForms.has(form)
  );
  settings.formsOrder = [
    ...importedFormsOrder,
    ...initialSettings.formsOrder.filter(
      (form) => !importedFormsOrder.includes(form)
    ),
  ];
  return settings;
};

export const createResumeDataFile = (
  resume: Resume,
  settings: Settings
): ResumeDataFile => ({
  app: RESUME_DATA_FILE_APP,
  version: RESUME_DATA_FILE_VERSION,
  exportedAt: new Date().toISOString(),
  resume,
  settings,
});

export const stringifyResumeDataFile = (resume: Resume, settings: Settings) =>
  `${JSON.stringify(createResumeDataFile(resume, settings), null, 2)}\n`;

export const parseResumeDataFile = (text: string) => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  const resumeCandidate = getResumeCandidate(parsed);
  if (!resumeCandidate) {
    throw new Error("The selected file does not contain resume data.");
  }

  const settingsCandidate = getSettingsCandidate(parsed);
  return {
    resume: mergeResumeWithInitialState(resumeCandidate),
    settings: mergeSettingsWithInitialState(settingsCandidate),
  };
};

export const getResumeDataFileName = (name: string) => {
  const sanitizedName = name
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `${sanitizedName || "resume"}-open-resume.json`;
};
