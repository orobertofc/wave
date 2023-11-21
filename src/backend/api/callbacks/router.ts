import { Router } from "express";
import { Spotify } from "../controllers/Spotify.js";
import { callback_for } from "./logic.js";
import { Deezer } from "../controllers/Deezer.js";

export const callback_router: Router = Router();

callback_router.get("/spotify", callback_for(new Spotify()));
callback_router.get("/deezer", callback_for(new Deezer()));
