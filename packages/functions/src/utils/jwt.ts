import jwt from "jsonwebtoken";
import { Resource } from "sst";
import { CookieOptions } from "express";
import { z } from "zod";

import {
  accessJwtInputSchema,
  REFRESH_TOKEN,
  refreshJWTInputSchema,
} from "@dododo/core";
import {
  ACCESS_TOKEN_EXPIRATION_SECONDS,
  REFRESH_TOKEN_EXPIRATION_SECONDS,
} from "@/const";

type TAccessJwtPayload = z.infer<typeof accessJwtInputSchema>;

export const generateAccessToken = (payload: TAccessJwtPayload) => {
  const token = jwt.sign(payload, Resource.AccessTokenSecret.value, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_SECONDS,
  });

  return {
    accessJWT: token,
  };
};

type TRefreshJwtPayload = z.infer<typeof refreshJWTInputSchema>;

export const generateRefreshToken = (payload: TRefreshJwtPayload) => {
  const token = jwt.sign(payload, Resource.RefreshTokenSecret.value, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_SECONDS,
  });

  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_EXPIRATION_SECONDS * 1000, // 30 days
  };
  return {
    refreshJWT: token,
    refreshCookie: {
      name: REFRESH_TOKEN,
      val: token,
      options,
    },
  };
};
