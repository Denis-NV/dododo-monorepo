import { Request, Response } from "express";

import { db, userTable } from "@dododo/db";

export const createUser = async (req: Request, res: Response) => {
  const query = await db.select({ id: userTable.id }).from(userTable).limit(1);

  console.log(">>>", req.body);
  console.log("-->", query);

  res.status(200).json({
    message: `add user`,
    req: req.body,
  });
};
