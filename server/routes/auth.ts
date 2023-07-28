import express from "express";
import upload from "../config/fileStorage";
import { register, login, logout } from "../controllers/authController";
import loginLimiter from '../middleware/loginLimiter';

const router = express.Router();

router.post("/register", upload.single("picture"), register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

export default router;