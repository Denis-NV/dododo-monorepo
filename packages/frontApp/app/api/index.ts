import { Resource } from "sst";
import { TInsertUser } from "@dododo/db";

type TCreateUserBody = Pick<TInsertUser, "email"> & {
  username: string;
  password: string;
};

export const createUser = async (body: TCreateUserBody) => {
  const response = await fetch(`${Resource.dododoApi.url}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};
