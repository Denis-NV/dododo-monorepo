import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const { accessToken, headers } = await getCurrentSession(request.headers);

  if (!accessToken) {
    return redirect("/login", { headers });
  }

  return data({ ok: true }, { headers });
};

export default loader;
