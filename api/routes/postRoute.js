import express from "express"
import { verifyToken } from "../utils/authUser.js"
import { createPost } from "../controllers/postController.js"

const router = express.Router()

router.post('/create', verifyToken, createPost)

export default router