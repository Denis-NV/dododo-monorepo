import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { logOut } from "@/api";
import { destroyCurrentSession, getCurrentSession } from "@/utils/session";

const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await getCurrentSession(request.headers);

  if (!user) {
    return redirect("/login");
  }

  const { error, message } = await logOut({
    body: {
      id: user.userId,
    },
  });

  console.log("Logout", error || message);

  if (error) {
    return {
      formErrors: [`Failed to log out. ${error}`],
      fieldErrors: {},
    };
  }

  const { headers } = await destroyCurrentSession(request.headers);

  console.log("Logout headers", headers);

  return redirect("/login", { headers });
};

export default action;
