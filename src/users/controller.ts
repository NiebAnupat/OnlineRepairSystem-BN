import { Request, Response } from "express";
import service from "./service";
import User from "./UserModel";

const getAll = async (req: Request, res: Response) => {
  try {
    const users = await service.findAll();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await service.findOne({ user_id: id });
    if (user) {
      return res.status(200).json(user);
    }
    res.status(404).json({ error: "User not found" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const create = async (req: Request, res: Response) => {
  const newUse: User = req.body;
  try {
    const user = await service.create(newUse);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedUser: User = req.body;
  try {
    const user = await service.update({ user_id: id }, updatedUser);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await service.delete({ user_id: id });
        res.status(204).json();
    } catch (error) {
        if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        }
        res.status(500).json({ error: "Something went wrong" });
    }
};

export { getAll, getOne , create, update, remove };
