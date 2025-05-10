import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";
import { getUserEmailVerificationRequest } from "@/utils/email-verification";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, headers } = await getCurrentSession(request.headers);

  if (!user) {
    return redirect("/login");
  }

  if (user.emailVerified) {
    return redirect("/login");
  }

  const { headers: apiHeaders, resent } = await getUserEmailVerificationRequest(
    request.headers,
    user
  );

  headers?.append("set-cookie", apiHeaders?.get("set-cookie") ?? "");

  return data({ resent }, { headers });
};

export default loader;
