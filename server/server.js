import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { logger, logEvents } from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import connectDB from "./config/dbConnection";
import corsOptions from "./config/corsOptions";
import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import postsRoutes from "./routes/posts";
import "express-async-errors";

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
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
   origin: "https://hovir.netlify.app/"
}));

// app.use(function (req, res, next) {
//    res.setHeader('Access-Control-Allow-Credentials', true)
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   )
//   if (req.method === 'OPTIONS') {
//     res.status(200).end()
//     return
//   }
//    next();
// })

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

app.all("*", (req, resp) => {
  resp.status(404);
  if (req.accepts("html")) {
    resp.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    resp.json({ message: "404 Not Found!" });
  } else {
    resp.type("txt").send("404 Not Found!");
  }
});

/* MONGOOSE */
connectDB();

const PORT = process.env.PORT || 3333;
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

// interface CustomError extends Error {
//   no?: number;
//   code?: string;
//   syscall?: string;
//   hostname?: string;
// }

mongoose.connection.on("error", (err) => {
  console.error(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}\n`,
    "mongoErrorLog.log"
  );
});
