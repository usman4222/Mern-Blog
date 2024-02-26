import express from "express"
import { verifyToken } from "../utils/authUser.js"
import { createPost, getPosts } from "../controllers/postController.js"

const router = express.Router()

router.post('/create', verifyToken, createPost)
router.get('/getposts', getPosts)

export default router