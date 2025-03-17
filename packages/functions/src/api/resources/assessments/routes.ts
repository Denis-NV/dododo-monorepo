import { Router } from "express";
import { getAll } from "./controller";

const router = Router();

router.get("/assesment", getAll);

export default router;
