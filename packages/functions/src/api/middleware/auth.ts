import { Request, Response } from "express";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { Resource } from "sst";

import { accessJwtOutputSchema, AUTHORIZATION } from "@dododo/core";

type TAccessJwtPayload = z.infer<typeof accessJwtOutputSchema>;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers[AUTHORIZATION];
  console.log(req.headers);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, Resource.AccessTokenSecret.value, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const accessPayload: TAccessJwtPayload = JSON.parse(
      atob(token.split(".")[1])
    );

    if (!accessPayload.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    next();
  });
};
