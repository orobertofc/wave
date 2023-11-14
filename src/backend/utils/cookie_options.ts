import { CookieOptions } from "express";
import { Token_interface } from "../interfaces/common/Token_interface.js";

export function access_cookie_options(token: Token_interface): CookieOptions {
  return {
    expires: new Date(Date.now() + token.expires_in * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  };
}

export function refresh_cookie_options(): CookieOptions {
  return {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  };
}
