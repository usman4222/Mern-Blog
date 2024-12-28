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
    const { email, password } = req.body;
  
    if (!email || !password || email === "" || password === "") {
      return next(ErrorHandler(400, "Email or password is required"));
    }
  
    try {
      const validUser = await User.findOne({ email });
  
      if (!validUser) {
        return next(ErrorHandler(404, "Invalid Email or Password"));
      }
  
      const validPassword = bcryptjs.compareSync(password, validUser.password);
  
      if (!validPassword) {
        return next(ErrorHandler(404, "Invalid Email or Password"));
      }
  
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      const { password: pass, ...rest } = validUser._doc;
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({ success: true, user: rest });
    } catch (error) {
      next(error);
    }
  };
  





export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000  
            });

            const { password, ...rest } = user._doc;
            return res.status(200).json({ user: rest });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profileImage: googlePhotoUrl
            });

            user = await newUser.save();

            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  
                maxAge: 24 * 60 * 60 * 1000  
            });

            const { password, ...rest } = user._doc;
            return res.status(200).json({ user: rest });
        }
    } catch (error) {
        next(error);
    }
};
