import { useMemo } from "react";
import assessmentData from "../data/assessmentData.json";

export interface AssessmentOption {
  score: string;
  value: string;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  level: string;
  options: AssessmentOption[];
}

export interface AssessmentData {
  emotions: AssessmentQuestion[];
}

// In-memory cache for the assessment data
let cachedAssessmentData: AssessmentData | null = null;

/**
 * Custom hook that loads and caches assessment data
 * @returns {AssessmentData} The cached assessment data
 */
export const useAssessmentData = (): AssessmentData => {
  return useMemo(() => {
    if (!cachedAssessmentData) {
      cachedAssessmentData = assessmentData as AssessmentData;
    }
    return cachedAssessmentData;
  }, []);
};

/**
 * Server-side utility function to get assessment data
 * Can be used in loaders and actions
 * @returns {AssessmentData} The assessment data
 */
export const getAssessmentData = (): AssessmentData => {
  if (!cachedAssessmentData) {
    cachedAssessmentData = assessmentData as AssessmentData;
  }
  return cachedAssessmentData;
};

/**
 * Get questions for a specific skill/category
 * @param skill - The skill category (e.g., 'emotions')
 * @returns {AssessmentQuestion[]} Array of questions for the skill
 */
export const getQuestionsForSkill = (skill: string): AssessmentQuestion[] => {
  const data = getAssessmentData();
  return data[skill as keyof AssessmentData] || [];
};

export default useAssessmentData;
