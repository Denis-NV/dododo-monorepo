import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = request.headers.get("Cookie");

  console.log(">> token", token);
  // const { user } = getCurrentSession();

  // if (user === null) {
  //   return redirect("/login");
  // }

  return data({ ok: true });
};

export default loader;
