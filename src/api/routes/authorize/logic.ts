import { Request, Response, NextFunction } from "express";
import { Streaming } from "../../../interfaces/services/Streaming_class.js";

type ExpressRouteFunc = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => void | Promise<void>;

// Pass the streaming service and this function will call the redirection method for the user to authorize access to their account
export function authorize_to(service: Streaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    await service.get_authorization_code(res);
  };
}
