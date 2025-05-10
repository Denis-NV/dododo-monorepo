import { Router } from "express";
import { getAuthenticatedUser } from "./controller";
import { authMiddleware } from "@/api/middleware/auth";

const router = Router();

router.get("/user", authMiddleware, getAuthenticatedUser);

export default router;
