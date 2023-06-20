import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose, { Callback } from "mongoose";

import { logger, logEvents } from "./middleware/logger";
import errorHandler from "./middleware/errorHandler"; 
import connectDB from './config/dbConnection';


/* CONFIGURATIONS */
dotenv.config();
const app = express();

app.use(logger);
app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb: Callback) => {
        cb(null, 'public/assets');
    },
    filename: (req, file: Express.Multer.File, cb: Callback) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

/* MONGOOSE */
connectDB();

const PORT = process.env.PORT || 3333;
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  });
  
  interface CustomError extends Error {
    no?: number;
    code?: string;
    syscall?: string;
    hostname?: string;
  }
  
  mongoose.connection.on("error", (err: CustomError) => {
    console.error(err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}\n`,
      "mongoErrorLog.log"
    );
  });

