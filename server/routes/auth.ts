import express from "express";
import upload from "../config/fileStorage";
import { register, login, refresh, logout } from "../controllers/authController";
import loginLimiter from '../middleware/loginLimiter';

const router = express.Router();

router.post("/register", upload.single("picture"), register);
router.post("/login", loginLimiter, login);
router.get("/refresh", refresh)
router.post("/logout", logout);

export default router;