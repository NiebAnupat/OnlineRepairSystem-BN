import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import service from "../users/service";

const secret_key = process.env.SECRET_KEY || "MySecretKey";

const login = async (req: Request, res: Response) => {
  const { user_id, password } = req.body;

  try {
    const user = await service.findOne({ user_id });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "password is wrong" });
    }

    const token = jwt.sign({ user_id: user.user_id }, secret_key, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const auth = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, secret_key, { maxAge: "7d" }) as {
      user_id: string;
    };
    const user = await service.findOne({ user_id: decoded.user_id });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { password, avatar, ...userWithoutPasswordAndAvatar } = user;
    return res.status(200).json({ ...userWithoutPasswordAndAvatar });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
};

export { login, auth };
