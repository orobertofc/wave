import { Router } from "express";
import { callback_router } from "./callbacks/router.js";
import { routes_router } from "./routes/router.js";

export const api_router: Router = Router();

api_router.use("/callbacks", callback_router);
api_router.use(routes_router);
