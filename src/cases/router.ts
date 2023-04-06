import Express from "express";
import {
  getAll,
  getOne,
  getByQuery,
  create,
  update,
  remove,
} from "./controller";
import upload from "../middleware/upload";

const router = Express.Router();

// GET /cases
router.get("/", getAll);
router.get("/by", getByQuery); // EX. /cases/by?name=xxx
router.get("/:id", getOne);


// POST /cases
router.post("/", upload.array("images"), create);

// PUT /cases/:id
router.put("/:id", upload.array("images"), update);

// DELETE /cases/:id
router.delete("/:id", remove);

export default router;
