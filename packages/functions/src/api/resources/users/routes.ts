import { Router } from "express";
import { createUser } from "./controller";

const router = Router();

router.post("/user", createUser);

export default router;
