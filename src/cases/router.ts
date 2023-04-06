import Express from "express";
import {
  getAll,
  getOne,
  getByQuery,
  create,
  technicalUpdate,
  userUpdate,
  adminUpdate,
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

// PUT /cases/:id/role
router.put("/:id/tec", technicalUpdate);
router.put("/:id/user", userUpdate);
router.put("/:id/admin", adminUpdate);

// DELETE /cases/:id
router.delete("/:id", remove);

export default router;
