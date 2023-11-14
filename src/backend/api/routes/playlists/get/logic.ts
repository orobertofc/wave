import { ExpressRouteFunc } from "../../../../interfaces/common/Express_func.js";
import { Istreaming } from "../../../../interfaces/services/Streaming_class.js";
import { Request, Response } from "express";

export function get_playlists_from(service: Istreaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    try {
      console.log("function called");
      const playlists = await service.get_library(req.cookies.access_token);
      res.status(200).json(playlists);
    } catch (err) {
      if (err.message === "Token expired") {
        res.status(401).send("Token expired");
      }
    }
  };
}
