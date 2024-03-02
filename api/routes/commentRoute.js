import express from "express"
import { createComment } from "../controllers/commentController.js"
import { verifyToken } from "../utils/authUser.js"

const router = express.Router()


router.post('/create', verifyToken, createComment)

export default router