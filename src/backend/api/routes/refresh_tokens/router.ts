import { NextFunction, Request, Response, Router } from "express";
import { refresh_access } from "./logic.js";
import { Spotify } from "../../controllers/Spotify.js";

export const refresh_router = Router();

// Check if refresh token is provided
function middleware(req: Request, res: Response, next: NextFunction) {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    res.status(401).send("No refresh token provided");
    return;
  }
  next();
}
refresh_router.use(middleware);

refresh_router.post("/spotify", refresh_access(new Spotify()));
