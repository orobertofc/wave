import { Token_interface } from "../common/Token_interface.js";
import { Response } from "express";

export interface Streaming {
  get_authorization_code(response: Response): Promise<void>;
  get_access_token(code: string, needle: any): Promise<Token_interface>;
  get_playlists(access_token: string, needle: any): Promise<any>;
  create_playlist(
    name: string,
    access_token: string,
    needle: any,
  ): Promise<any>;
}
