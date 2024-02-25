import Post from "../models/postModel.js"
import { ErrorHandler } from "../utils/error.js"

export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(ErrorHandler(403, "You are not allowed to create post"))
    }
    if (!req.body.title || !req.body.content) {
        return next(ErrorHandler(400, "Please provide all fields"))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    })
    try {
        const savedPost = await newPost.save()
        res.status(201).json({ savedPost })
    } catch (error) {
        next(error)
    }
}