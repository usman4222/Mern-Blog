import Comment from "../models/commentModel.js"
import { ErrorHandler } from "../utils/error.js"


export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body

        if (userId !== req.user.id) {
            return next(ErrorHandler(403, 'You are not allowed to create this comment'))
        }
        const newComment = new Comment({
            content,
            postId,
            userId
        })
        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}


export const getPostComment = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1
        })
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}



export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(ErrorHandler(404, "Comment not Found"));
        }

        const userIndex = comment.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            // User is not in the likes array
            comment.numberOfLikes = Math.max(0, comment.numberOfLikes) + 1;
            comment.likes.push(req.user.id);
        } else {
            // User is already in the likes array
            comment.numberOfLikes = Math.max(0, comment.numberOfLikes - 1);
            comment.likes.splice(userIndex, 1); // Remove user like
        }

        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};


export const editComment = async (req, res, next) => {
    try {

        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(ErrorHandler(404, 'Comment not found'))
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(ErrorHandler(404, "You are not allowed to edit this comment"))
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content
        }, { new: true })

        res.status(200).json(editedComment)
    } catch (error) {
        next(error)
    }
}