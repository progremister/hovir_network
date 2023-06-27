import express, { Request, Response } from "express";
import upload from "../config/fileStorage";
import verifyJWTMiddleware from "../middleware/auth";
import { createPost } from "../controllers/postsController";

const router = express.Router();

router.post("/", verifyJWTMiddleware, upload.single("picture"), createPost)

router.get("/", verifyJWTMiddleware, getFeedPosts);
router.get("/:userId/posts", verifyJWTMiddleware, getUserPosts);
router.patch("/:id/like", verifyJWTMiddleware, likePost);

export default router;