import express, { Request, Response } from 'express';
import { getUser, getUserFriends, manageFriend } from "../controllers/usersController";
import verifyJWTMiddleware from "../middleware/auth";

const router = express.Router();

router.use(verifyJWTMiddleware);

router.get("/:id", getUser);
router.get("/:id/friends", getUserFriends);

router.patch("/:id/friendId", manageFriend);

export default router;

