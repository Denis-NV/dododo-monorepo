import { Router } from "express";
import { registerUser, refresh } from "./controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/refresh", refresh);

export default router;
