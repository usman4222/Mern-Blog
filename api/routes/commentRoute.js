import express from "express"
import { createComment, editComment, getPostComment } from "../controllers/commentController.js"
import { verifyToken } from "../utils/authUser.js"
import { likeComment } from "../controllers/userController.js"

const router = express.Router()


router.post('/create', verifyToken, createComment)``
router.get('/getpostcomments/:postId', getPostComment)
router.put('/likecomment/:commentId', verifyToken, likeComment)
router.put('/editcomment/:commentId', verifyToken, editComment)

export default router