import { ActionFunctionArgs } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

// Define the schema for assessment form validation
export const assessmentSchema = z.object({
  question1: z.string().min(1, "Please select an answer for Question 1"),
  question2: z.string().min(1, "Please select an answer for Question 2"),
  question3: z.string().min(1, "Please select an answer for Question 3"),
  question4: z.string().min(1, "Please select an answer for Question 4"),
});

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: assessmentSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Log the answers to console
  console.log("Assessment answers:", submission.value);

  // Return the submission with success status
  return submission.reply({ resetForm: true });
};

export default action;
