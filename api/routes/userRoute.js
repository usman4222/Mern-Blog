import express from "express";
import { test, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/authUser.js";

const router = express.Router()

router.get('/', test)
router.put('/update/:userId', verifyToken, updateUser)

export default router;