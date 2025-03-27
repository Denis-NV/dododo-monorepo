import { Resource } from "sst";
import { TInsertUser } from "@dododo/core/db";

type TCreateUserPayload = {
  email: string;
  username: string;
  password: string;
};

const test: TInsertUser = {
  useasfsx: 1,
};

console.log(test);

export const createUser = async (payload: TCreateUserPayload) => {
  const response = await fetch(`${Resource.dododoApi.url}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return await response.json();
};
