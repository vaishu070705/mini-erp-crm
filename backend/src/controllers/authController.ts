import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail,
} from "../models/userModel";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(
      fullName,
      email,
      hashedPassword
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};
