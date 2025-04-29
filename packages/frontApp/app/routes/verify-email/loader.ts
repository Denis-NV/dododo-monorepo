import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCurrentSession } from "@/utils/session";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("Cookie");

  const session = getCurrentSession(cookies);

  console.log("--> session", session);

  // if (user === null) {
  //   return redirect("/login");
  // }

  return data({ ok: true });
};

export default loader;
