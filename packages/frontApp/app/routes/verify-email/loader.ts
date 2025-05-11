import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";
import { getUserEmailVerificationRequest } from "@/utils/email-verification";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, headers } = await getCurrentSession(request.headers);

  console.log(
    "--> Verify Email Loader: session cookies",
    headers.getSetCookie()
  );

  if (!user) {
    return redirect("/login", { headers });
  }

  if (user.emailVerified) {
    return redirect("/", { headers });
  }

  return data({ user }, { headers });
};

export default loader;
