import express from "express";
import { Protected } from "../middleware/AuthMiddleware.js";
import {
  changePassword,
  createUser,
  deleteUserAccount,
  getMe,
  login,
  resetPassword,
  updateUserDetails,
} from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", login);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/me", Protected, getMe);
userRouter.post("/change-password", Protected, changePassword);
userRouter.patch("/update", Protected, updateUserDetails);
userRouter.delete("/delete", Protected, deleteUserAccount);

export default userRouter;
