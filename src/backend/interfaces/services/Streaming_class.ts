import { Token_interface } from "../common/Token_interface.js";
import { Response } from "express";
import { Library_interface } from "../common/Library_interface.js";

export abstract class Istreaming {
  abstract get_authorization_code(response: Response): Promise<void>;
  abstract get_access_token(
    code: string,
    needle: any,
  ): Promise<Token_interface>;
  abstract refresh_access_token(
    refresh_token: string,
    needle: any,
  ): Promise<Token_interface>;
  abstract get_library(access_token: string): Promise<Library_interface>;
  abstract create_playlist(
    name: string,
    access_token: string,
    needle: any,
  ): Promise<any>;
}
