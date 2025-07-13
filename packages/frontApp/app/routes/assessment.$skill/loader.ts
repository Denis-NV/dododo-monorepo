import { data, LoaderFunctionArgs } from "@remix-run/node";
import { getSkillData, getAvailableSkills } from "@/utils/assessmentData";

const loader = async ({ params }: LoaderFunctionArgs) => {
  const skill = params.skill;

  if (!skill) {
    throw new Response("Skill not specified", { status: 400 });
  }

  const skillData = getSkillData(skill);

  if (!skillData) {
    throw new Response("Skill not found", { status: 404 });
  }

  const availableSkills = getAvailableSkills();

  return data({
    skill: params.skill,
    skillData,
    availableSkills,
  });
};

export default loader;
