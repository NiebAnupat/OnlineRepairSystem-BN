import Express from "express";
import { getAll, getOne } from "./controller";

const router = Express.Router();

// GET /cases
router.get("/", getAll);
router.get("/:id", getOne);

export default router;
