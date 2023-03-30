import { Request, Response } from "express";
import service from "./service";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await service.findAll();
  res.json(users);
};

export { getAllUsers };
