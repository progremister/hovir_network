import express from "express";
import upload from "../config/fileStorage";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post("/register", upload.single("picture"), register);
router.post("/login", login);

export default router;