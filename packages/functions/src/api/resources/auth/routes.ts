import { Router } from "express";
import { registerUser, login, refresh } from "./controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);

export default router;
