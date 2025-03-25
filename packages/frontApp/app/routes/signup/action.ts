import { ActionFunctionArgs } from "@remix-run/node";
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

  const password = typeof payload.password === "string" ? payload.password : "";
  const strongPassword = await verifyPasswordStrength(password);

  if (!strongPassword) {
    return {
      payload,
      formErrors: ["Failed to submit. Please try again later."],
      fieldErrors: {
        password: "Password is too weak",
      },
    };
  }

  return null;
};

export default action;
