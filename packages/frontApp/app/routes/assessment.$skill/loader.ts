import { data, LoaderFunctionArgs } from "@remix-run/node";

const loader = async ({ params }: LoaderFunctionArgs) => {
  return data({ skill: params.skill });
};

export default loader;
