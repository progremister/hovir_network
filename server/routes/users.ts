import express, { Request, Response } from 'express';
const router = express.Router();
import { getUser, getUserFriends, manageFriend } from "../controllers/usersController";

import verifyJWTMiddleware from "../middleware/auth";

router.get("/:id", verifyJWTMiddleware, getUser);
router.get("/:id/friends", verifyJWTMiddleware, getUserFriends);

router.patch("/:id/friendId", verifyJWTMiddleware, manageFriend);

export default router;

