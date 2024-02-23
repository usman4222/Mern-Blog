import User from "../models/Usermodel.js"
import bcryptjs from "bcryptjs"

export const signUp = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        return res.status(200).json({ message: "All fields are required" })
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
        res.status(500).json(error.message)
    }
} 