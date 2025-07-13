import { ActionFunctionArgs } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { getSkillData } from "@/utils/assessmentData";

// Generate schema dynamically based on assessment data
const generateAssessmentSchema = (skill: string) => {
  const skillData = getSkillData(skill);
  const schemaObject: Record<string, z.ZodString> = {};

  if (skillData) {
    skillData.questions.forEach((question) => {
      schemaObject[question.id] = z
        .string()
        .min(1, `Please select an answer for ${question.question}`);
    });
  }

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

  // Get skill data for additional processing if needed
  const skillData = getSkillData(skill);

  if (!skillData) {
    throw new Response("Skill not found", { status: 404 });
  }

  // Log the answers to console with question context
  console.log(`\n=== ${skillData.title} Assessment Results ===`);
  Object.entries(submission.value).forEach(([questionId, answer]) => {
    const question = skillData.questions.find((q) => q.id === questionId);
    const option = question?.options.find((opt) => opt.value === answer);

    console.log(`Question: ${question?.question}`);
    console.log(`Answer: ${option?.label} (${answer})`);
    console.log(`Score: ${option?.score}`);
    console.log("---");
  });

  // Return the submission with success status
  return submission.reply({ resetForm: true });
};

export default action;
