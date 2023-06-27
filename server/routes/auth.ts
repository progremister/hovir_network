import express from "express";
const router = express.Router();

import upload from "../config/fileStorage";
import { register, login } from "../controllers/authController";

router.post("/register", upload.single("picture"), register);
router.post("/login", login);

export default router;