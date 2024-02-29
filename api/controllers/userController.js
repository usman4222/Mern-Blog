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

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(ErrorHandler(403, "You are not allowed to delete user"))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("User deleted successfuly")
    } catch (error) {
        next(error)
    }
}


export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
            .status(200)
            .json("User Sign Out Successfully")
    } catch (error) {
        next(error)
    }
}


export const getUsers = async (req, res, next) => {
    // if (!req.user.isAdmin) {
    //     return next(ErrorHandler(403, "You are not allowed to create post"))
    // }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      const totalUsers = await User.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });
    } catch (error) {
      next(error);
    }
  };