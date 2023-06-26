import express from "express";
const router = express.Router();

import upload from "../config/fileStorage";

import authController from "../controllers/authController";

router.post("/register", upload.single("picture"), authController.register);
router.post("/login", authController.login);


export default router;