import winston from "winston";
import { env } from "./env";

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    ...(env.NODE_ENV === "production"
      ? [new winston.transports.File({ filename: "logs/error.log", level: "error" })]
      : []),
  ],
  exitOnError: false,
});