import { Router } from "express";
import { refresh } from "./controller";

const router = Router();

router.post("/auth/refresh", refresh);

export default router;
