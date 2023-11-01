import { Streaming } from "../../interfaces/services/Streaming_class.js";
import * as process from "process";
import { Response } from "express";
import * as querystring from "querystring";
import { Token_interface } from "../../interfaces/common/Token_interface.js";

export class Spotify implements Streaming {
  private readonly client_id: string;
  private readonly client_secret: string;
  private readonly redirect_uri: string;
  private readonly scope: string;
  constructor(
    client_id?: string,
    client_secret?: string,
    redirect_uri?: string,
    scope?: string,
  ) {
    this.client_id = client_id || process.env.SPOTIFY_ID;
    this.client_secret = client_secret || process.env.SPOTIFY_SECRET;
    this.redirect_uri = redirect_uri || process.env.SPOTIFY_REDIRECT_URI;
    this.scope = scope || process.env.SPOTIFY_SCOPE;
  }

  public async get_authorization_code(response: Response): Promise<void> {
    // Redirect the user to get the authorization code
    response.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: this.client_id,
          scope: this.scope,
          redirect_uri: this.redirect_uri,
        }),
    );
  }

  public async get_access_token(
    code: string,
    needle: typeof import("needle"),
  ): Promise<Token_interface> {
    // specify what we want from Spotify
    const request_body = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.redirect_uri,
    };

    // Auth header for identifying our app to Spotify
    const request_headers = {
      Authorization: `Basic ${Buffer.from(
        `${this.client_id}:${this.client_secret}`,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // Return a Promise to handle the asynchronous operation
    return new Promise((resolve, reject) => {
      needle.post(
        "https://accounts.spotify.com/api/token",
        request_body,
        {
          headers: request_headers,
        },
        (err, resp, body) => {
          if (err) {
            reject(err);
          } else {
            console.log("Status code:", resp.statusCode);
            console.log("Body:", body);
            const tokens: Token_interface = {
              expires_in: body.expires_in,
              access_token: body.access_token,
              refresh_token: body.refresh_token,
            };
            resolve(tokens);
          }
        },
      );
    });
  }

  get_playlists(access_token: string, needle: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  create_playlist(
    name: string,
    access_token: string,
    needle: any,
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
