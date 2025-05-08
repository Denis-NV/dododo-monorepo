import { Router } from "express";
import { registerUser, login, logout, refresh } from "./controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refresh);

export default router;
