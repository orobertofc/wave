import { Request, Response } from "express";
import { Istreaming } from "../../../interfaces/services/Streaming_class.js";
import { ExpressRouteFunc } from "../../../interfaces/common/Express_func.js";

// Pass the streaming service and this function will call the redirection method for the user to authorize access to their account
export function authorize_to(service: Istreaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    await service.get_authorization_code(res);
  };
}
