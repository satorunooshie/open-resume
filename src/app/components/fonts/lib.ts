"use client";
import {
  CJK_FONT_FAMILY,
  ENGLISH_FONT_FAMILIES,
  NON_ENGLISH_FONT_FAMILIES,
  NON_ENGLISH_FONT_FAMILY_TO_LANGUAGE,
  type FontFamily,
} from "components/fonts/constants";
import type { Resume } from "lib/redux/types";

const CJK_CHARACTER_REGEX =
  /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const ASCII_ALPHANUMERIC_REGEX = /^[A-Za-z0-9]+$/;
const PROHIBITED_LINE_START_CHARACTERS = new Set(
  Array.from("、。，．｡､!?！？:;：；)]}）］｝〕〉》」』】〙〗〟’”｠»")
);
const PROHIBITED_LINE_END_CHARACTERS = new Set(
  Array.from("([{（［｛〔〈《「『【〘〖〝‘“｟«")
);

const ALL_FONT_FAMILIES = [
  ...ENGLISH_FONT_FAMILIES,
  ...NON_ENGLISH_FONT_FAMILIES,
] as const;

const isKnownFontFamily = (fontFamily: string): fontFamily is FontFamily => {
  return (ALL_FONT_FAMILIES as readonly string[]).includes(fontFamily);
};

const isEnglishFontFamily = (fontFamily: string) => {
  return (ENGLISH_FONT_FAMILIES as readonly string[]).includes(fontFamily);
};

const DEFAULT_PDF_FONT_FAMILY = ENGLISH_FONT_FAMILIES[0];

const languageMatches = (preferredLanguage: string, fontLanguage: string) => {
  return (
    preferredLanguage === fontLanguage ||
    preferredLanguage.startsWith(`${fontLanguage}-`)
  );
};

const getResumeText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(getResumeText).join(" ");
  if (value && typeof value === "object") {
    return Object.values(value).map(getResumeText).join(" ");
  }
  return "";
};

export const valueHasCJKCharacters = (value: unknown) => {
  return CJK_CHARACTER_REGEX.test(getResumeText(value));
};

export const resumeHasCJKCharacters = (resume: Resume) => {
  return valueHasCJKCharacters(resume);
};

const splitTextIntoCJKWrapUnits = (word: string) => {
  const units: string[] = [];
  let latinWord = "";

  for (const char of Array.from(word)) {
    if (ASCII_ALPHANUMERIC_REGEX.test(char)) {
      latinWord += char;
      continue;
    }

    if (latinWord) {
      units.push(latinWord);
      latinWord = "";
    }
    units.push(char);
  }

  if (latinWord) {
    units.push(latinWord);
  }

  return units;
};

const keepProhibitedLineStartCharactersWithPreviousUnit = (units: string[]) => {
  const chunks: string[] = [];

  for (const unit of units) {
    const firstChar = Array.from(unit)[0];
    if (chunks.length > 0 && PROHIBITED_LINE_START_CHARACTERS.has(firstChar)) {
      chunks[chunks.length - 1] += unit;
    } else {
      chunks.push(unit);
    }
  }

  return chunks;
};

const keepProhibitedLineEndCharactersWithNextUnit = (units: string[]) => {
  const chunks: string[] = [];

  for (let idx = 0; idx < units.length; idx++) {
    let unit = units[idx];
    while (
      idx + 1 < units.length &&
      PROHIBITED_LINE_END_CHARACTERS.has(Array.from(unit).at(-1) ?? "")
    ) {
      idx += 1;
      unit += units[idx];
    }
    chunks.push(unit);
  }

  return chunks;
};

export const getCJKWrapUnits = (word: string) => {
  if (!word) return [word];

  return keepProhibitedLineEndCharactersWithNextUnit(
    keepProhibitedLineStartCharactersWithPreviousUnit(
      splitTextIntoCJKWrapUnits(word)
    )
  );
};

export const getResumePDFTextFontFamily = (
  resume: Resume,
  fontFamily: string,
  ...additionalValues: unknown[]
): FontFamily => {
  const hasCJKCharacters =
    resumeHasCJKCharacters(resume) ||
    additionalValues.some(valueHasCJKCharacters);

  if (hasCJKCharacters) {
    if (!isKnownFontFamily(fontFamily) || isEnglishFontFamily(fontFamily)) {
      return CJK_FONT_FAMILY;
    }
  }

  return isKnownFontFamily(fontFamily) ? fontFamily : DEFAULT_PDF_FONT_FAMILY;
};

/**
 * getPreferredNonEnglishFontFamilies returns non-english font families that are included in
 * user's preferred languages. This is to avoid loading fonts/languages that users won't use.
 */
const getPreferredNonEnglishFontFamilies = () => {
  return NON_ENGLISH_FONT_FAMILIES.filter((fontFamily) => {
    const fontLanguages = NON_ENGLISH_FONT_FAMILY_TO_LANGUAGE[fontFamily];
    const userPreferredLanguages = navigator.languages ?? [navigator.language];
    return userPreferredLanguages.some((preferredLanguage) =>
      fontLanguages.some((fontLanguage) =>
        languageMatches(preferredLanguage, fontLanguage)
      )
    );
  });
};

export const getAllFontFamiliesToLoad = () => {
  return [...ENGLISH_FONT_FAMILIES, ...getPreferredNonEnglishFontFamilies()];
};

export const getAllFontFamiliesToRegister = () => {
  return [...ALL_FONT_FAMILIES];
};
