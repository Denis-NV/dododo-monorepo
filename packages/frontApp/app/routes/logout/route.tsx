import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import logInAction from "./action";
import logInLoader from "./loader";

export const meta: MetaFunction = () => {
  return [
    { title: "Log Out" },
    { name: "description", content: "Log out of your account" },
  ];
};

export const loader = logInLoader;
export const action = logInAction;

const Logout = () => {
  const result = useActionData<typeof action>();

  return (
    <div className="p-4 flex justify-center items-center h-screen">
      <div>
        <h1 className="mb-6 text-2xl">Log Out</h1>
        <Form method="post" className="flex flex-col space-y-2">
          <div className="flex flex-row justify-end pt-4">
            <button
              type="submit"
              className="bg-slate-800 text-white px-2 py-1 rounded-md "
            >
              Log out
            </button>
          </div>
        </Form>

        <p className="text-red-700 text-sm mt-2 max-w-[340px]">
          {result?.formErrors}
        </p>
      </div>
    </div>
  );
};
export default Logout;
