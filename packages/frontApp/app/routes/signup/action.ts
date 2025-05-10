import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";

import { registerUser } from "@/api";
import { getPropogatedCookiesHeaders } from "@/utils/cookies";
import { updateSession } from "@/utils/session";

export const createUserInput = z
  .object({
    email: z.coerce.string().email().min(5),
    password: z.coerce
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
      ),
    confirm: z.coerce.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  // Then parse it with zod
  const result = createUserInput.safeParse(payload);

  if (!result.success) {
    const error = result.error.flatten();

    return {
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  const {
    accessToken,
    error,
    headers: apiHeaders,
  } = await registerUser({
    body: {
      username: result.data.email,
      email: result.data.email,
      password: result.data.password,
    },
  });

  if (!accessToken) {
    return {
      formErrors: [`Failed to create a new user. ${error}`],
      fieldErrors: {},
    };
  }

  const propCookieHeaders = getPropogatedCookiesHeaders(apiHeaders);

  const headers = await updateSession(propCookieHeaders, accessToken);

  return redirect("/verify-email", { headers });
};

export default action;
