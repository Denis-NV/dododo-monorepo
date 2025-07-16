import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/";

  const { accessToken, user, headers } = await getCurrentSession(
    request.headers
  );

  if (accessToken) {
    if (!user?.emailVerified) return redirect("/verify-email", { headers });

    return redirect(redirectTo, { headers });
  }

  return data({ redirectTo }, { headers });
};

export default loader;
