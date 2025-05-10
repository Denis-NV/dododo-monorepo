import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";
import { getProfile } from "@/api";
import { AUTHORIZATION } from "@dododo/core";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, headers, accessToken } = await getCurrentSession(
    request.headers
  );

  if (!user?.emailVerified) {
    return redirect("/login", { headers });
  }

  const {
    user: fullUser,
    error,
    message,
  } = await getProfile({
    reqHeaders: new Headers({ [AUTHORIZATION]: `Bearer ${accessToken}` }),
  });
  console.log(fullUser, error, message);

  return data({ user: fullUser }, { headers });
};

export default loader;
