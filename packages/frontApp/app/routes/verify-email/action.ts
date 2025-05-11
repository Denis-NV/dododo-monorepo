import {
  getUserEmailVerificationRequest,
  getVerifiedUser,
} from "@/utils/email-verification";
import { getCurrentSession } from "@/utils/session";
import { ActionFunctionArgs, data, redirect } from "@remix-run/node";
import { z } from "zod";

const verifyEmailInput = z.object({
  code: z.coerce.string(),
});

const action = async ({ request }: ActionFunctionArgs) => {
  const { user, headers } = await getCurrentSession(request.headers);

  console.log(
    "--> Verify Email Action: session cookies",
    headers.getSetCookie()
  );

  if (!user) {
    return redirect("/login", { headers });
  }

  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const result = verifyEmailInput.safeParse(payload);

  if (!result.success) {
    const error = result.error.flatten();

    return {
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  const { resent, headers: emailRequestHeaders } =
    await getUserEmailVerificationRequest(request.headers, user);

  console.log(
    "--> Verify Action: get verification:",
    resent,
    emailRequestHeaders
  );

  if (!emailRequestHeaders) {
    return {
      resent,
      formErrors: ["Can't find email verification request"],
    };
  }

  if (resent) {
    return data({ resent }, { headers: emailRequestHeaders });
  }

  const {
    headers: emailVerifyHeaders,
    verified,
    error,
  } = await getVerifiedUser(emailRequestHeaders, {
    userId: user.userId,
    code: result.data.code,
  });

  console.log(
    "--> Verify Action: get user:",
    verified,
    emailVerifyHeaders,
    error
  );

  if (!verified) {
    return { formErrors: [error] };
  }

  return redirect("/", { headers: emailVerifyHeaders });
};

export default action;
