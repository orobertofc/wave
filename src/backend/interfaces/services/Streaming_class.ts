import { Token_interface } from "../common/Token_interface.js";
import { Response } from "express";
import { Library_interface } from "../common/Library_interface.js";
import axios from "axios";

export abstract class Istreaming {
  abstract get_authorization_code(response: Response): Promise<void>;
  abstract get_access_token(
    code: string,
    Axios: typeof axios,
  ): Promise<Token_interface>;

  // Deezr wants to be different and does not provide an access token
  abstract refresh_access_token?(
    refresh_token: string,
    Axios: typeof axios,
  ): Promise<Token_interface>;
  abstract get_library(access_token: string): Promise<Library_interface>;
  abstract create_playlist(
    name: string,
    access_token: string,
    Axios: typeof axios,
  ): Promise<any>;
}
