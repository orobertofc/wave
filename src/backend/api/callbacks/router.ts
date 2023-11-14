import { Router } from "express";
import { Spotify } from "../controllers/Spotify.js";
import { callback_for } from "./logic.js";

export const callback_router: Router = Router();

callback_router.get("/spotify", callback_for(new Spotify()));
callback_router.get("/deezer", (req, res) => {
  res.send("route in construction");
});
