import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { loginUserRequestBody } from "@dododo/db";

import { logIn } from "@/api";
import { getPropogatedCookiesHeaders } from "@/utils/cookies";
import { updateSession } from "@/utils/session";

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const result = loginUserRequestBody.safeParse(payload);

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
  } = await logIn({
    email: result.data.email,
    password: result.data.password,
  });

  if (!accessToken) {
    return {
      formErrors: [`Failed to log in. ${error}`],
      fieldErrors: {},
    };
  }

  const propCookieHeaders = getPropogatedCookiesHeaders(apiHeaders);

  const headers = await updateSession(propCookieHeaders, accessToken);

  return redirect("/", { headers });
};

export default action;
