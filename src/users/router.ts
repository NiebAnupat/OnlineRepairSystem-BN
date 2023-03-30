import Express from "express";
import { getAll, getOne, create, update, remove } from "./controller";
import upload from "../middleware/upload";

const router = Express.Router();

// GET /users
router.get("/", getAll);
router.get("/:id", getOne);

// POST /users
router.post("/", upload.single("image"), create);

// PUT /users/:id
router.put("/:id", upload.single("image"), update);

// DELETE /users/:id
router.delete("/:id", remove);

export default router;
