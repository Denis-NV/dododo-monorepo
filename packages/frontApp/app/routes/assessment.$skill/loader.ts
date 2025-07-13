import { data, LoaderFunctionArgs } from "@remix-run/node";
import {
  getAssessmentData,
  getQuestionsForSkill,
} from "@/utils/assessmentData";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const skill = params.skill;

  if (!skill) {
    throw new Response("Skill not specified", { status: 400 });
  }

  const assessmentData = getAssessmentData();
  const questions = getQuestionsForSkill(skill);

  return data({
    skill: params.skill,
    assessmentData,
    questions,
  });
};

export default loader;
