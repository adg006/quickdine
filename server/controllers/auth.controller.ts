import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

// Generate a JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password before saving (you can use bcrypt or any other hashing library)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Get a user
export const getUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    res.json(req.user);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
