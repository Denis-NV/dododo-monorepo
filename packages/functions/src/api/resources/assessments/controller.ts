import { Request, Response } from "express";
// import { sql } from "drizzle-orm";

export const getAll = async (req: Request, res: Response) => {
  // const query = await db.execute(sql`SELECT NOW()`);

  res.status(200).json({
    message: `Hello Denis`,
    // res: query,
  });
};
