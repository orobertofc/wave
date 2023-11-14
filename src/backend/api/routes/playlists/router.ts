import { Router } from "express";
import { get_playlist_router } from "./get/router.js";

export const playlists_router: Router = Router();

playlists_router.use("/get", get_playlist_router);
