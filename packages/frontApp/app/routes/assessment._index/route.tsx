import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "dododo Assessment" },
    { name: "description", content: "Start your assessment" },
  ];
};

const Assessment = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Assessment</h1>
      <Link to="/assessment/emotions">Start an assessment</Link>
    </div>
  );
};

export default Assessment;
