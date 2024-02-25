import User from "../models/Usermodel.js"
import bcryptjs from "bcryptjs"
import { ErrorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

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


export const signIn = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === "" || password === "") {
        return next(ErrorHandler(400, "Email or password is required"))
    }

    try {
        const validUser = await User.findOne({ email })

        if (!validUser) {
            return next(ErrorHandler(404, "Invalid Email and Password"))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password)

        if (!validPassword) {
            return next(ErrorHandler(404, "Invalid Email and Password"))
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        const { password: pass, ...rest } = validUser._doc

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest)

    } catch (error) {
        next(error)
    }
}



export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body

    const user = await User.findOne({ email })

    try {
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password, ...rest } = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);            
        }
        else {
            const generatedPassowrd = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassowrd, 10)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profileImage: googlePhotoUrl
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);            
        }
    } catch (error) {
        next(error)
    }
}