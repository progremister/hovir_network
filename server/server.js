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

app.use(cors({
  origin: "https://hovir.vercel.app",
  methods: ["POST", "GET", "OPTIONS", "PUT"],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://hovir.vercel.app");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Options-Success", "true");
  console.log("CORS headers set:", res.getHeaders());
  next();
});

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
