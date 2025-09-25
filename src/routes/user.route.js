import express from "express";
import { login, logout, profile, register, verifyEmail } from "../controller/user.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.get("/profile", authenticateToken, profile);
router.post("/logout", authenticateToken, logout);
export default router;