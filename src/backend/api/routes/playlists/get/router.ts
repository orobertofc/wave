import { Router } from "express";
import { get_playlists_from } from "./logic.js";
import { Spotify } from "../../../controllers/Spotify.js";
import { Deezer } from "../../../controllers/Deezer.js";

export const get_playlist_router: Router = Router();

get_playlist_router.get("/spotify", get_playlists_from(new Spotify()));
get_playlist_router.get("/deezer", get_playlists_from(new Deezer()));
