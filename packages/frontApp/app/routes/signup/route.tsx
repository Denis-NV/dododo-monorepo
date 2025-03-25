import type { MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import signUpAction from "./action";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Create an account" },
  ];
};

export const action = signUpAction;

const SignUp = () => {
  const result = useActionData<typeof action>();

  return (
    <div className="p-4 flex justify-center items-center h-screen">
      <div>
        <h1 className="mb-6 text-2xl">SignUp</h1>
        <Form method="post" className="flex flex-col space-y-2">
          <div>
            <div className="flex flex-row space-x-2">
              <label htmlFor="form-signup.email" className="flex-1">
                Email:
              </label>
              <div className="flex-4">
                <input
                  id="form-signup.email"
                  name="email"
                  type="email"
                  required
                  className="border border-gray-300 rounded-sm"
                />
              </div>
            </div>
            <p className="text-red-700 text-sm mt-2 text-right">
              {result?.fieldErrors.email}
            </p>
          </div>

          <div>
            <div className="flex flex-row space-x-4">
              <label htmlFor="form-signup.password" className="flex-1">
                Password:
              </label>
              <div className="flex-4 ">
                <input
                  id="form-signup.password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="border border-gray-300 rounded-sm"
                />
              </div>
            </div>
            <p className="text-red-700 text-sm mt-2 text-right">
              {result?.fieldErrors.password}
            </p>
          </div>

          <div className="flex flex-row justify-end pt-4">
            <button
              type="submit"
              className="bg-slate-800 text-white px-2 py-1 rounded-md "
            >
              Submit
            </button>
          </div>
        </Form>

        <p className="text-red-700 text-sm mt-2 text-right">
          {result?.formErrors}
        </p>
      </div>
    </div>
  );
};
export default SignUp;
