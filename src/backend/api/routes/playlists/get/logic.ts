import { ExpressRouteFunc } from "../../../../interfaces/common/Express_func.js";
import { Istreaming } from "../../../../interfaces/services/Streaming_class.js";
import { Request, Response } from "express";
import { identify_service } from "../../../../utils/identify_service.js";

export function get_playlists_from(service: Istreaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    try {
      const service_name = identify_service(service);
      const token: string = req.cookies[`${service_name}_access_token`];

      const playlists = await service.get_library(token);
      res.status(200).json({ service: service_name, items: playlists });
    } catch (err) {
      if (err.message === "Token expired") {
        res.status(401).send("Token expired");
      }
    }
  };
}
