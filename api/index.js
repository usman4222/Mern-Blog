import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import postRoutes from "./routes/postRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-blog-ecqy.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.log("Error while connecting to the database", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    console.error("Error while starting the server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
