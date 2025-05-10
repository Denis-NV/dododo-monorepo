import { Router } from "express";
import {
  registerUser,
  login,
  logout,
  refresh,
  resentEmailVerification,
  verifyEmail,
} from "./controller";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refresh);
router.post("/auth/resend-email-verification", resentEmailVerification);
router.post("/auth/verify-email", verifyEmail);

export default router;
