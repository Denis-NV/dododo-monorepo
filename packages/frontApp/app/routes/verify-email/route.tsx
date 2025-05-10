import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";

import verifyEmailAction from "./action";
import verifyEmailLoader from "./loader";

export const meta: MetaFunction = () => {
  return [
    { title: "Verify Email" },
    { name: "description", content: "Verify your email" },
  ];
};

export const action = verifyEmailAction;
export const loader = verifyEmailLoader;

const VerifyEmail = () => {
  const { user } = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();

  return (
    <div className="p-4 flex justify-center items-center h-screen">
      <div className="max-w-[300px]">
        <h1 className="mb-6 text-2xl text-center">Verify Email</h1>
        <p className="mb-4 text-sm">We sent an 8-digit code to {user.email}.</p>
        <Form method="post" className="flex flex-col space-y-2">
          <div>
            <div className="flex flex-row space-x-2">
              <label htmlFor="form-signup.code" className="flex-1">
                Code:
              </label>
              <div className="flex-4">
                <input
                  id="form-signup.code"
                  name="code"
                  type="text"
                  className="border border-gray-300 rounded-sm"
                />
              </div>
            </div>
            <p className="text-red-700 text-sm mt-2 max-w-[340px]">
              {result?.fieldErrors?.code?.map((e, i) => (
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
              Verify
            </button>
          </div>
        </Form>

        {result?.resent && (
          <p className="text-green-700 text-sm mt-2 max-w-[340px]">
            Verification code resent. Please check your email.
          </p>
        )}

        <p className="text-red-700 text-sm mt-2 max-w-[340px]">
          {result?.formErrors}
        </p>
      </div>
    </div>
  );
};
export default VerifyEmail;
