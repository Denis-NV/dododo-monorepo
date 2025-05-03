import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import logInAction from "./action";
import logInLoader from "./loader";

export const meta: MetaFunction = () => {
  return [
    { title: "Log In" },
    { name: "description", content: "Log in to your account" },
  ];
};

export const loader = logInLoader;
export const action = logInAction;

const Login = () => {
  const result = useActionData<typeof action>();

  return (
    <div className="p-4 flex justify-center items-center h-screen">
      <div>
        <h1 className="mb-6 text-2xl">Log In</h1>
        <Form method="post" className="flex flex-col space-y-2">
          <div>
            <div className="flex flex-row space-x-2">
              <label htmlFor="form-login.email" className="flex-1">
                Email:
              </label>
              <div className="flex-4">
                <input
                  id="form-login.email"
                  name="email"
                  type="email"
                  className="border border-gray-300 rounded-sm"
                />
              </div>
            </div>
            <p className="text-red-700 text-sm mt-2 max-w-[340px]">
              {result?.fieldErrors.email?.map((e, i) => (
                <span key={i} className="block">
                  {e}
                </span>
              ))}
            </p>
          </div>

          <div>
            <div className="flex flex-row space-x-4">
              <label htmlFor="form-login.password" className="flex-1">
                Password:
              </label>
              <div className="flex-4 ">
                <input
                  id="form-login.password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="border border-gray-300 rounded-sm"
                />
              </div>
            </div>
            <p className="text-red-700 text-sm mt-2 max-w-[340px]">
              {result?.fieldErrors.password?.map((e, i) => (
                <span key={i} className="block">
                  {e}
                </span>
              ))}
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

        <Link to="/signup">Create an account</Link>

        <p className="text-red-700 text-sm mt-2 max-w-[340px]">
          {result?.formErrors}
        </p>
      </div>
    </div>
  );
};
export default Login;
