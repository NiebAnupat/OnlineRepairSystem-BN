import { Request, Response } from "express";
import service from "./service";

const getAll = async (req: Request, res: Response) => {
  try {
    const cases = await service.findAll();
    res.status(200).json(cases);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getOne = async (req: Request, res: Response) => {};

const create = async (req: Request, res: Response) => {};

const update = async (req: Request, res: Response) => {};

const remove = async (req: Request, res: Response) => {};

export { getAll, getOne };
