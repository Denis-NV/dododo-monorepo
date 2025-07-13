import { Router } from "express";
import { createUpdateAssessment } from "./controller";
import { authMiddleware } from "@/api/middleware/auth";

const router = Router();

router.post("/assessment", authMiddleware, createUpdateAssessment);

export default router;
