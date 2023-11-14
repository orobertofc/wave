import { NextFunction, Request, Response, Router } from "express";
import { callback_router } from "./callbacks/router.js";
import { authorize_router } from "./routes/authorize/router.js";
import { refresh_router } from "./routes/refresh_tokens/router.js";
import { playlists_router } from "./routes/playlists/router.js";

export const api_router: Router = Router();

api_router.use("/callbacks", callback_router);
api_router.use(routes_router);
api_router.use("/authorize", authorize_router);
api_router.use("/refresh", refresh_router);
api_router.use("/playlists", playlists_router);
