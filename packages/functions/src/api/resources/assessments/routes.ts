import { Router } from "express";
import { createUpdateAssessment } from "./controller";
import { authMiddleware, userRLSMiddleware } from "@/api/middleware/auth";

const router = Router();

router.post(
  "/assessment",
  authMiddleware,
  userRLSMiddleware,
  createUpdateAssessment
);

export default router;
