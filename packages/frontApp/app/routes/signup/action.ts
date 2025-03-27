import { ActionFunctionArgs } from "@remix-run/node";
import { Resource } from "sst";

import { verifyPasswordStrength } from "@/utils/password";

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  console.log(payload.email);
  console.log(payload.password);

  // TODO: Maybe implement request origin checking

  // const todo = await fakeCreateTodo({
  //   title: body.get("title"),
  // });
  // return redirect(`/todos/${todo.id}`);

  if (payload.email === "" || payload.password === "") {
    return {
      payload,
      formErrors: ["Failed to submit. Please try again later."],
      fieldErrors: {
        email: "Email is required",
        password: "Password",
      },
    };
  }

  // TODO: Consider moving this check to the API
  const password = typeof payload.password === "string" ? payload.password : "";
  const strongPassword = await verifyPasswordStrength(password);

  // Consider hashing the password before sending it to the server

  if (!strongPassword) {
    return {
      payload,
      formErrors: ["Failed to submit. Please try again later."],
      fieldErrors: {
        password: "Password is too weak",
      },
    };
  }

  const response = await fetch(`${Resource.dododoApi.url}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const responseBody = await response.json();

  console.log(">", responseBody);

  return null;
};

export default action;
