import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";

import verifyEmailLoader from "./loader";

export const meta: MetaFunction = () => {
  return [
    { title: "Profile" },
    { name: "description", content: "Your profile" },
  ];
};

export const loader = verifyEmailLoader;

const VerifyEmail = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="p-4 flex justify-center items-center h-screen">
      <div className="max-w-[300px]">
        <h1 className="mb-6 text-2xl text-center">Hello</h1>
      </div>
    </div>
  );
};
export default VerifyEmail;
