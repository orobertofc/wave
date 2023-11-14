import { Request, Response } from "express";
import { Istreaming } from "../../interfaces/services/Streaming_class.js";
import { Token_interface } from "../../interfaces/common/Token_interface.js";
import { ExpressRouteFunc } from "../../interfaces/common/Express_func.js";
import {
  access_cookie_options,
  refresh_cookie_options,
} from "../../utils/cookie_options.js";
import axios from "axios";

//handles the logic for the given service. Just call this function with the service you want to handle
export function callback_for(service: Istreaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    try {
      const code: string = req.query.code as string;
      const error = req.query.error;

      if (error) {
        console.log(error);
        res.status(500).send("Something went wrong, please try again later");
        return;
      }

      const result: Token_interface = await service.get_access_token(
        code,
        axios,
      );
      res
        .cookie(
          "access_token",
          result.access_token,
          access_cookie_options(result),
        )
        .cookie("refresh_token", result.refresh_token, refresh_cookie_options())
        .status(200)
        .send("You can close this window");

      return;
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong, please try again later");
    }
  };
}
