import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { getSkillData } from "@/utils/assessmentData";
import { createUpdateAssessment } from "@/api";
import { getCurrentSession } from "@/utils/session";
import { AUTHORIZATION } from "@dododo/core";

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

const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const skill = params.skill || "emotions";

  // Get current session for user authentication
  const { user, accessToken } = await getCurrentSession(request.headers);

  if (!user || !accessToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

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

  // Transform the form data into the assessment structure
  const assessmentData = {
    [skill]: submission.value,
  };

  try {
    // Create headers for the API request
    const headers = new Headers();
    headers.set(AUTHORIZATION, `Bearer ${accessToken}`);

    // Save the assessment to the database
    const { assessment, error } = await createUpdateAssessment({
      body: {
        userId: user.userId,
        assessment: assessmentData,
      },
      reqHeaders: headers,
    });

    if (error) {
      console.error("Failed to save assessment:", error);
      return submission.reply({
        formErrors: ["Failed to save assessment. Please try again."],
      });
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

    // Redirect to assessment overview on success
    return redirect("/assessment");
  } catch (error) {
    console.error("Error saving assessment:", error);
    return submission.reply({
      formErrors: ["An unexpected error occurred. Please try again."],
    });
  }
};

export default action;
