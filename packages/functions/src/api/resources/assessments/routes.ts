import { Router } from "express";
import { index } from "./controller";

const router = Router();

router.get("/assesment", index);

export default router;
