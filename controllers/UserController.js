import { userModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import { sendEmail } from "../utils/emailServices.js";
// import { server } from "emailjs";

// const server = server.connect({
//   user: "your_emailjs_user_id",
//   password: "your_emailjs_secret",
//   host: "smtp.your-emailjs-server.com",
//   ssl: true,
// });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

export const createUser = async (req, res) => {
  try {
    const { firstName, email, password, lastName, phoneNumber, role } =
      req.body;
    if (
      !firstName ||
      !email ||
      !password ||
      !lastName ||
      !role ||
      !phoneNumber
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const isUserAvailable = await userModel.findOne({ email });
    if (isUserAvailable) {
      return res.status(400).json({ error: "User already exists" });
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

    // const emailSubject = "Welcome on board";
    // const emailText = `Welcome to Pet store, enjoy your time selecting from the best pet`;
    // await sendEmail(email, emailSubject, emailText);

    const token = generateToken(user.id);

    res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      token,
      id: user.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      token,
      id: user.id,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      id: user.id,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Hash the temporary password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt);

    // Update user's password with the temporary password
    user.password = hashedPassword;
    await user.save();

    // Send the temporary password to the user's email
    // const message = {
    //   text: `Your new temporary password is: ${temporaryPassword}. Please change it after logging in.`,
    //   from: "Chisom abiodunjayb@gmail.com", // Update with your email and name
    //   to: email,
    //   subject: "Password Reset",
    // };

    // await server.send(message);

    res.status(200).json({
      message:
        "Password reset successfully. Check your email for the temporary password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old password and new password are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, password, phoneNumber, role } =
      req.body;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update user details
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) {
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (role) user.role = role;

    // Save the updated user
    await user.save();

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      id: user.id,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Delete the user
    await user.remove();

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
