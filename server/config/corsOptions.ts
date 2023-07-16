import { Callback } from "mongoose";
import allowedOrigins from "./allowedOrigins";
import { CorsOptions } from "cors";

type OriginFunction = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;

const corsOptions: CorsOptions = {
  origin: ((origin: string, callback: Callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS! "), false);
    }
  }) as OriginFunction,
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
