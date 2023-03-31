import Express from "express";
import { login, auth } from "./controller";

const router = Express.Router();

// POST /auth/
router.post("/", login);

// GET /auth/:token
router.get("/:token", auth);

export default router;
