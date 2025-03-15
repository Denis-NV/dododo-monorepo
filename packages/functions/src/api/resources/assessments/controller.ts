import { Request, Response } from "express";
import { Resource } from "sst";

export const index = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: `Hello. Linked to ${Resource.dododoStorage.name}.` });
};
