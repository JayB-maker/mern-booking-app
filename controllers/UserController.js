import { userModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export const createUser = async (req, res) => {
  const { firstName, email, password, lastName, phoneNumber, role } = req.body;
  if (!firstName || !email || !password || !lastName || !role || !phoneNumber) {
    res.status(400);
    res.send("All fields are required");
  }
  const isUserAvailable = await userModel.findOne({ email });
  if (isUserAvailable) {
    res.status(400);
    res.send("User already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    firstName,
    email,
    lastName,
    role,
    phoneNumber,
    password: hashedPassword,
  });

  res.status(201);
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber,
    token: generateToken(user.id),
    id: user.id,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.send("All fields are required");
  }

  const user = await userModel.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber,
      token: generateToken(user.id),
      id: user.id,
    });
  } else {
    res.status(400);
    throw new Error("invalid credentials");
  }
};

export const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (user) {
    res.status(200);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      id: user.id,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
};
