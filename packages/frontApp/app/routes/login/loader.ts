import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const { accessToken, user, headers } = await getCurrentSession(
    request.headers
  );

  if (accessToken) {
    if (!user?.emailVerified) return redirect("/verify-email", { headers });

    return redirect("/", { headers });
  }

  return data({ ok: true }, { headers });
};

export default loader;
