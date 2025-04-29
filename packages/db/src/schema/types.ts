import { z } from "zod";

import { selectUserTableSchema } from "./validation";

export type TSessionUser = Pick<
  z.infer<typeof selectUserTableSchema>,
  "id" | "email" | "username" | "emailVerified"
>;
