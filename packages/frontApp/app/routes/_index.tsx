import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "dododo Assessment" },
    { name: "description", content: "Welcome to dododo" },
  ];
};

export default function Index() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">dododo assessment</h1>
      <form className="pt-2">
        <div className="flex flex-row gap-2 items-center">
          <label htmlFor="firstName">First Name: </label>
          <input id="firstName" className="border-2" />
        </div>
      </form>
    </div>
  );
}
