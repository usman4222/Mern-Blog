import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, 
}));


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});


mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDB is connected');
    })
    .catch((error) => {
        console.log('Error while connecting to the database', error);
    });

const PORT = process.env.PORT || 3000;  
app.listen(PORT, (error) => {
    if (error) {
        console.error('Error while starting the server:', error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
