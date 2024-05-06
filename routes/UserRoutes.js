import express from "express";
import { createUser, getMe, login } from "../controllers/userController.js";
import { Protected } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.get("/me", Protected, getMe);

export default router