import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';

dotenv.config()

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Mongo is connected');
    })
    .catch((error) => {
        console.log('Error while connecting DB', error);
    });

const app = express();
app.use(express.json())

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.error('Error while starting the server:', error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)