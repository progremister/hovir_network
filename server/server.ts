import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose, { Callback } from "mongoose";

import { logger, logEvents } from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import connectDB from "./config/dbConnection";
import corsOptions from "./config/corsOptions";
import authRoutes from "./routes/auth";

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
app.use(cors(corsOptions));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
app.use("/auth", authRoutes);

app.all("*", (req: Request, resp: Response) => {
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
