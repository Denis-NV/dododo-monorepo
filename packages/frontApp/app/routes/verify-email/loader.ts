import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";

const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("====> Verify Email Loader");

  const { user, headers } = await getCurrentSession(request.headers);

  console.log(
    "<==== Verify Email Loader: session cookies",
    headers.getSetCookie()
  );
  console.log("--> Verify Email Loader: session user", user);

  if (!user) {
    return redirect("/login", { headers });
  }

  if (user.emailVerified) {
    return redirect("/", { headers });
  }

  return data({ user }, { headers });
};

export default loader;
