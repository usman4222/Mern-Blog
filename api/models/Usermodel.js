import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "img"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


const User = mongoose.model('User', userSchema)

export default User