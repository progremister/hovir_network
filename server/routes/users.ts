import express from 'express';
import { getUser, getUserFollows, manageFollow } from "../controllers/usersController";
import verifyJWTMiddleware from "../middleware/auth";

const router = express.Router();

router.use(verifyJWTMiddleware);

router.get("/:id", getUser);
router.get("/:id/followers", getUserFollows);

router.patch("/:id/followerId", manageFollow);

export default router;

