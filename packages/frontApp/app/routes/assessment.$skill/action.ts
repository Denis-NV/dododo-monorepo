import { ActionFunctionArgs } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  getAssessmentData,
  getQuestionsForSkill,
} from "../../utils/useAssessmentData";

// Generate schema dynamically based on assessment data
const generateAssessmentSchema = (skill: string) => {
  const questions = getQuestionsForSkill(skill);
  const schemaObject: Record<string, z.ZodString> = {};

  questions.forEach((question) => {
    schemaObject[question.id] = z
      .string()
      .min(1, `Please select an answer for ${question.question}`);
  });

  return z.object(schemaObject);
};

// Default schema (can be used as fallback)
export const assessmentSchema = z.object({
  question1: z.string().min(1, "Please select an answer for Question 1"),
  question2: z.string().min(1, "Please select an answer for Question 2"),
  question3: z.string().min(1, "Please select an answer for Question 3"),
  question4: z.string().min(1, "Please select an answer for Question 4"),
});

const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const skill = params.skill || "emotions";

  // Use dynamic schema based on the skill
  const schema = generateAssessmentSchema(skill);

  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Get assessment data for additional processing if needed
  const assessmentData = getAssessmentData();
  const questions = getQuestionsForSkill(skill);

  // Log the answers to console with question context
  console.log(`Assessment answers for ${skill}:`, submission.value);
  console.log("Questions context:", questions);

  // Return the submission with success status
  return submission.reply({ resetForm: true });
};

export default action;
