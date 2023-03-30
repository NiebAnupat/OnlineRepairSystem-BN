import Express from "express";
import { getAll, getOne, create, update, remove } from "./controller";

const router = Express.Router();

// GET /users
router.get("/", getAll);
router.get("/:id", getOne);

// POST /users
router.post("/", create);

// PUT /users/:id
router.put("/:id", update);

// DELETE /users/:id
router.delete("/:id", remove);

export default router;
