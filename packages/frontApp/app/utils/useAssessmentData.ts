import { useMemo } from "react";
import { z } from "zod";
import assessmentDataV1 from "../data/assessmentDataV1.json";
import assessmentDataV2 from "../data/assessmentDataV2.json";

// Available assessment data versions
const assessmentDataVersions = {
  v1: assessmentDataV1,
  v2: assessmentDataV2,
} as const;

export type AssessmentVersion = keyof typeof assessmentDataVersions;

// Zod schema for assessment data validation
export const assessmentOptionSchema = z.object({
  score: z.string(),
  value: z.string(),
  label: z.string(),
});

export const assessmentQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  level: z.string(),
  options: z.array(assessmentOptionSchema),
});

export const assessmentDataSchema = z.object({
  emotions: z.array(assessmentQuestionSchema),
});

// Inferred types from Zod schemas
export type AssessmentOption = z.infer<typeof assessmentOptionSchema>;
export type AssessmentQuestion = z.infer<typeof assessmentQuestionSchema>;
export type AssessmentData = z.infer<typeof assessmentDataSchema>;

/**
 * Server-side utility function to get and validate assessment data
 * Can be used in loaders and actions
 * @param version - The version of assessment data to use (defaults to 'v1')
 * @returns {AssessmentData} The validated assessment data
 * @throws {Error} If validation fails
 */
export const getAssessmentData = (version: AssessmentVersion = 'v1'): AssessmentData => {
  const assessmentData = assessmentDataVersions[version];
  const result = assessmentDataSchema.safeParse(assessmentData);

  if (!result.success) {
    console.error(`Assessment data validation failed for version ${version}:`, result.error.flatten());
    throw new Error(`Invalid assessment data (${version}): ${result.error.message}`);
  }

  return result.data;
};

/**
 * Get questions for a specific skill/category with validation
 * @param skill - The skill category (e.g., 'emotions')
 * @param version - The version of assessment data to use (defaults to 'v1')
 * @returns {AssessmentQuestion[]} Array of validated questions for the skill
 */
export const getQuestionsForSkill = (skill: string, version: AssessmentVersion = 'v1'): AssessmentQuestion[] => {
  const data = getAssessmentData(version);
  const questions = data[skill as keyof AssessmentData] || [];

  // Questions are already validated as part of the main data validation
  // No need to re-validate each question individually
  return questions;
};

/**
 * Get all available skill categories
 * @param version - The version of assessment data to use (defaults to 'v1')
 * @returns {string[]} Array of available skill names
 */
export const getAvailableSkills = (version: AssessmentVersion = 'v1'): string[] => {
  const data = getAssessmentData(version);
  return Object.keys(data);
};

/**
 * Check if a skill category exists
 * @param skill - The skill category to check
 * @param version - The version of assessment data to use (defaults to 'v1')
 * @returns {boolean} Whether the skill exists
 */
export const hasSkill = (skill: string, version: AssessmentVersion = 'v1'): boolean => {
  try {
    const data = getAssessmentData(version);
    return skill in data && Array.isArray(data[skill as keyof AssessmentData]);
  } catch {
    return false;
  }
};

/**
 * Safely get questions for a skill with validation
 * @param skill - The skill category
 * @param version - The version of assessment data to use (defaults to 'v1')
 * @returns {AssessmentQuestion[] | null} Questions array or null if skill doesn't exist
 */
export const getQuestionsForSkillSafe = (
  skill: string,
  version: AssessmentVersion = 'v1'
): AssessmentQuestion[] | null => {
  if (!hasSkill(skill, version)) {
    return null;
  }
  return getQuestionsForSkill(skill, version);
};

/**
 * Custom hook that provides validated assessment data on client-side
 * @param version - The version of assessment data to use (defaults to 'v1')
 * @returns {AssessmentData | null} The validated assessment data or null if invalid
 */
export const useAssessmentData = (version: AssessmentVersion = 'v1'): AssessmentData | null => {
  return useMemo(() => {
    try {
      return getAssessmentData(version);
    } catch (error) {
      console.error(`Failed to load assessment data (${version}):`, error);
      return null;
    }
  }, [version]);
};

export default useAssessmentData;
