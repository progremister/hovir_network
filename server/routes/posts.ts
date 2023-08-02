import express, { Request, Response } from "express";
import upload from "../config/fileStorage";
import verifyJWTMiddleware from "../middleware/auth";
import { createPost, getFeedPosts, getUserPosts, likePost } from "../controllers/postsController";

const router = express.Router();

router.use(verifyJWTMiddleware);

router.post("/", upload.single("picture"), createPost)

router.get("/", getFeedPosts);
router.get("/:userId", getUserPosts);
router.patch("/:id/like", likePost);

export default router;