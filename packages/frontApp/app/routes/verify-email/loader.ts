import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import * as cookie from "cookie";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("Cookie");
  const parsedCookies = cookie.parse(cookies || "");

  console.log("refresh_token:", parsedCookies.refresh_token);
  console.log("access_token:", parsedCookies.access_token);
  console.log("email_verification:", parsedCookies.email_verification);

  if (parsedCookies.access_token) {
    const arrayToken = parsedCookies.access_token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));

    console.log("Payload:", tokenPayload.email);
  }

  // const { user } = getCurrentSession();

  // if (user === null) {
  //   return redirect("/login");
  // }

  return data({ ok: true });
};

export default loader;
