import { Request, Response } from "express";
import { sql } from "drizzle-orm";

import { db } from "@/db/client";

export const createUser = async (req: Request, res: Response) => {
  // const query = await db.execute(sql`SELECT NOW()`);

  console.log(">>>", req.body);

  res.status(200).json({
    message: `add user`,
    req: req.body,
  });
};
