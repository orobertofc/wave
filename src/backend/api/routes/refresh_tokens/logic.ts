import { Istreaming } from "../../../interfaces/services/Streaming_class.js";
import { Request, Response } from "express";
import { ExpressRouteFunc } from "../../../interfaces/common/Express_func.js";
import {
  access_cookie_options,
  refresh_cookie_options,
} from "../../../utils/cookie_options.js";
import { Token_interface } from "../../../interfaces/common/Token_interface.js";
import axios from "axios";

export function refresh_access(service: Istreaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    const token: Token_interface = await service.refresh_access_token(
      req.cookies.refresh_token,
      axios,
    );
    res
      .cookie("access_token", token.access_token, access_cookie_options(token))
      .cookie("refresh_token", token.refresh_token, refresh_cookie_options())
      .status(200);
  };
}
