import express, { CookieOptions, Request, Response } from "express";
import { Streaming } from "../../interfaces/services/Streaming_class.js";
import needle from "needle";
import { Token_interface } from "../../interfaces/common/Token_interface.js";

type ExpressRouteFunc = (req: Request, res: Response) => void | Promise<void>;

//handles the logic for the given service. Just call this function with the service you want to handle
export function callback_for(service: Streaming): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    try {
      const error = req.query.error;

      if (error) {
        console.log(error);
        res.status(500).send("Something went wrong, please try again later");
        return;
      }

      const result: Token_interface = await service.get_access_token(
        req.query.code as string,
        needle,
      );

      const access_cookie_options: CookieOptions = {
        expires: new Date(Date.now() + result.expires_in * 1000),
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      };

      const refresh_cookie_options: CookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      };

      res
        .cookie("access_token", result.access_token, access_cookie_options)
        .cookie("refresh_token", result.refresh_token, refresh_cookie_options)
        .status(200)
        .send("You can close this window");

      return;
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong, please try again later");
    }
  };
}
