import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

import { verifyPasswordStrength } from "@/utils/password";
import { createUser } from "@/api";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  // Then parse it with zod
  const result = schema.safeParse(payload);
  const submission = result.data;

  // TODO: Maybe implement request origin checking

  if (submission) {
    if (submission.email === "" || submission.password === "") {
      return {
        payload,
        formErrors: ["Failed to submit. Please try again later."],
        fieldErrors: {
          email: "Email is required",
          password: "Password",
        },
      };
    }

    // TODO: Consider moving this check to the API
    const strongPassword = await verifyPasswordStrength(submission.password);

    // Consider hashing the password before sending it to the server

    if (!strongPassword) {
      return {
        payload,
        formErrors: ["Failed to submit. Please try again later."],
        fieldErrors: {
          password: "Password is too weak",
        },
      };
    }

    const newUser = createUser({
      username: submission.email,
      email: submission.email,
      password: submission.password,
    });

    console.log(">", newUser);
  }

  return null;
};

export default action;
