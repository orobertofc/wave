import express from "express";
import cookieParser from "cookie-parser";
import { api_router } from "./api/api_router.js";
import cors from "cors";
import morgan from "morgan";

export const app = express();

// CORS stuff
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("./static"));

// Mount all api related routes on ./api_router.ts
app.use("/api", api_router);

// Basic check
app.get("/keep_alive", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// 404 handler
app.use(function (req, res, next) {
  res.status(404).sendFile("404.html", { root: "./src/static/404" });
});
