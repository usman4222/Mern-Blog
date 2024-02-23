import User from "../models/Usermodel.js"
import bcryptjs from "bcryptjs"
import { ErrorHandler } from "../utils/error.js"

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(ErrorHandler(400, "All fields are required"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save()
        res.json("Sign Up successfully")
    } catch (error) {
        next(error)
    }
} 