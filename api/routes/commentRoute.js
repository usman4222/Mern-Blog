import express from "express"
import { createComment, getPostComment } from "../controllers/commentController.js"
import { verifyToken } from "../utils/authUser.js"

const router = express.Router()


router.post('/create', verifyToken, createComment)
router.get('/getpostcomments/:postId', getPostComment)

export default router