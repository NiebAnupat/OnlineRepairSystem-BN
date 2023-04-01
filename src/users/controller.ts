import { Request, Response } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
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
      const { password, ...userWithoutPassword } = user; // Create new object without password property
      return res.status(200).json({ ...userWithoutPassword });
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
  try {
    const newUser: User = req.body;

    let img: Buffer;
    const uploadPath = path.join(process.cwd(), "src/assets/uploads/");
    if (req.file !== undefined) {
      img = fs.readFileSync(uploadPath + req.file.filename);
      newUser.avatar = img;
      fs.unlinkSync(uploadPath + req.file.filename); // delete uploaded file
    } else {
      img = fs.readFileSync(
        path.join(process.cwd(), "/src/assets/", "defaultAvatar.png")
      );
      newUser.avatar = img;
    }

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const user = await service.create(newUser);
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
    let img: Buffer;
    // const uploadPath = path.join(process.cwd(), "/assets/uploads/");
    const uploadPath = path.join(__dirname, "/assets/uploads/");
    if (req.file !== undefined) {
      img = fs.readFileSync(uploadPath + req.file.filename);
      updatedUser.avatar = img;
      fs.unlinkSync(uploadPath + req.file.filename); // delete uploaded file
    } else {
      img = fs.readFileSync(
        path.join(__dirname, "/assets/", "defaultAvatar.png")
      );
      updatedUser.avatar = img;
    }

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

export { getAll, getOne, create, update, remove };
