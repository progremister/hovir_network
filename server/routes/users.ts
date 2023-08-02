import express from 'express';
import { getUser, getUserConnects, manageConnect} from "../controllers/usersController";
import verifyJWTMiddleware from "../middleware/auth";

const router = express.Router();

router.use(verifyJWTMiddleware);

router.get("/:id", getUser);
router.get("/:id/connects", getUserConnects);

router.patch("/:id/connectId", manageConnect);

export default router;

