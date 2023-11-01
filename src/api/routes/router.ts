import { Router } from "express";
import { authorize_router } from "./authorize/router.js";

export const routes_router: Router = Router();

routes_router.use("/authorize", authorize_router);
