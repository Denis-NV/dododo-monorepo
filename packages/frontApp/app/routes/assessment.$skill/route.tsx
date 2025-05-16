import { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import assessmentLoader from "./loader";

import StepForm from "@/components/stepForm";
import { Heading } from "@radix-ui/themes";

export const meta: MetaFunction = () => {
  return [
    { title: "skill Assessment" },
    { name: "description", content: "Asses your skill" },
  ];
};

export const loader = assessmentLoader;

const Assessment = () => {
  const params = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <Heading as="h1" size="4">
        {params?.skill} assessment page
      </Heading>
      <StepForm />
    </div>
  );
};

export default Assessment;
