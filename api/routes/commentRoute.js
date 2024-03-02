import express from "express"
import { createComment, getPostComment } from "../controllers/commentController.js"
import { verifyToken } from "../utils/authUser.js"
import { likeComment } from "../controllers/userController.js"

const router = express.Router()


router.post('/create', verifyToken, createComment)
router.get('/getpostcomments/:postId', getPostComment)
router.get('/likecomment/:commentId', verifyToken, likeComment)

export default router