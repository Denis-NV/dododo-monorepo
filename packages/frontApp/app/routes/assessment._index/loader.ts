import { LoaderFunctionArgs } from "@remix-run/node";
import { getAssessmentData } from "@/utils/assessmentData";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const assessmentData = getAssessmentData();

  // Extract available skills from the assessment data
  const availableSkills = Object.keys(assessmentData);

  return {
    availableSkills,
    assessmentData,
  };
};

export default loader;
