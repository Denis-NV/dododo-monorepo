import { Router } from "express";
import { createUpdateAssessment } from "./controller";

const router = Router();

router.post("/assesment", createUpdateAssessment);

export default router;
