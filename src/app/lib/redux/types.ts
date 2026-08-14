export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  urls: string[];
  summary: string;
  location: string;
}

export interface ResumeWorkExperience {
  company: string;
  companyUrl: string;
  companyDescription: string;
  jobTitle: string;
  date: string;
  summary: string;
  descriptions: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
}

export interface ResumeProject {
  project: string;
  projectUrl: string;
  date: string;
  summary: string;
  descriptions: string[];
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
}

export type ResumeKey = keyof Resume;
