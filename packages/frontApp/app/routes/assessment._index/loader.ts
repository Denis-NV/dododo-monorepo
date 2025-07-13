import { LoaderFunctionArgs } from "@remix-run/node";
import { getAssessmentData, getAvailableSkills } from "@/utils/assessmentData";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const assessmentData = getAssessmentData();
  const availableSkills = getAvailableSkills();

  return {
    availableSkills,
    assessmentData,
  };
};

export default loader;
