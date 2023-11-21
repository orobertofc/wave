import { Router } from "express";
import { Spotify } from "../../controllers/Spotify.js";
import { authorize_to } from "./logic.js";
import { Deezer } from "../../controllers/Deezer.js";

export const authorize_router: Router = Router();

authorize_router.get("/spotify", authorize_to(new Spotify()));
authorize_router.get("/deezer", authorize_to(new Deezer()));
