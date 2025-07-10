import { data, LoaderFunctionArgs } from "@remix-run/node";
import {
  getAssessmentData,
  getQuestionsForSkill,
} from "../../utils/useAssessmentData";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const skill = params.skill || "emotions";
  const assessmentData = getAssessmentData();
  const questions = getQuestionsForSkill(skill);

  return data({
    skill: params.skill,
    assessmentData,
    questions,
  });
};

export default loader;
