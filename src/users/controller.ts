import { Request, Response } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import service from "./service";
import User, { UserUDO } from "./UserModel";
import getCurrentTime from "../lib/time";
import { isValidUser, hashPassword, decodePassword } from "./helper";

const getAll = async (req: Request, res: Response) => {
  try {
    const getImages = req.query.getImages as string;
    const users = await service.findAll(getImages === "true" ? true : false);
    users?.map((user) => {
      const { password, ...userWithoutPassword } = user; // Create new object without password property
      return userWithoutPassword;
    });
    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
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
    return res.status(404).json({ error: "User not found" });
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

    if (await isValidUser(newUser.user_id)) {
      return res.status(409).json({ error: "User already exists" });
    }
    let img: Buffer;
    if (req.file !== undefined) {
      const uploadPath = path.join(process.cwd(), "dist/src/assets/uploads/");
      console.log(uploadPath);
      img = fs.readFileSync(uploadPath + req.file.filename);
      newUser.avatar = img;
      fs.unlinkSync(uploadPath + req.file.filename); // delete uploaded file
    } else {
      img = fs.readFileSync(
        path.join(process.cwd(), "/src/assets/", "defaultAvatar.png")
      );
      newUser.avatar = img;
    }
    newUser.password = await hashPassword(newUser.password);
    newUser.changeAt = getCurrentTime();
    const user = await service.create(newUser);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedUser: UserUDO = req.body;
  try {
    if (!(await isValidUser(id))) {
      return res.status(404).json({ error: "User not found" });
    }
    let img: Buffer;
    if (req.file !== undefined) {
      const uploadPath = path.join(process.cwd(), "dist/src/assets/uploads/");
      img = fs.readFileSync(uploadPath + req.file.filename);
      fs.unlinkSync(uploadPath + req.file.filename); // delete uploaded file
      updatedUser.avatar = img;
    }

    if (updatedUser.password)
      updatedUser.password = await hashPassword(updatedUser.password);

    updatedUser.changeAt = getCurrentTime();
    const user = await service.update({ user_id: id }, updatedUser);
    // FIX : changeAt is not updated
    return res.status(200).json({
      msg: `User ID : ${user.user_id} updated at ${new Date(
        user.changeAt
      ).toLocaleString("th-TH")}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (await isValidUser(id)) {
      await service.delete({ user_id: id });
      return res.status(200).json({ message: "User deleted" });
    }
    return res.status(404).json({ error: "User not found" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

export { getAll, getOne, create, update, remove };
