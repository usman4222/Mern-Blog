import express from "express"
import { createComment, deleteComment, editComment, getComments, getPostComment, likeComment } from "../controllers/commentController.js"
import { verifyToken } from "../utils/authUser.js"

const router = express.Router()


router.post('/create', verifyToken, createComment)
router.get('/getpostcomments/:postId', getPostComment)
router.put('/likecomment/:commentId', verifyToken, likeComment)
router.put('/editcomment/:commentId', verifyToken, editComment)
router.delete('/deletecomment/:commentId', verifyToken, deleteComment)
router.get('/getcomments', verifyToken, getComments)

export default router