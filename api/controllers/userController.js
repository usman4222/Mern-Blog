import User from "../models/Usermodel.js"
import { ErrorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const test = (req, res) => {
    res.json({ message: "Api is working fine" })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(ErrorHandler(403, "You are not allowed to update this user"))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(ErrorHandler(400, "Password must be more than 6 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(ErrorHandler(400, "Username must be between 7 and 20 characters"))
        }
        if (req.body.username.includes(' ')) {
            return next(ErrorHandler(400, "Username cannot contain spaces"))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(ErrorHandler(400, "Username must be Lower case"))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(ErrorHandler(400, "Username can only contain letters and numbers"))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username, 
                email: req.body.email,
                profileImage: req.body.profileImage,
                password: req.body.password
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}