import Express from "express";
import { getAllUsers } from "./controller";

const router = Express.Router();

router.get("/", getAllUsers);

export default router;