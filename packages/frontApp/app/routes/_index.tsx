import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "dododo Homepage" },
    { name: "description", content: "Welcome to dododo" },
  ];
};

export default function Index() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Welcome to Dododo!</h1>
      <Link to="/assessment">Go to assessment page</Link>
    </div>
  );
}
