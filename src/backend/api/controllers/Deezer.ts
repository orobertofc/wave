import { Istreaming } from "../../interfaces/services/Streaming_class.js";
import * as process from "process";
import { Response } from "express";
import * as querystring from "querystring";
import { Token_interface } from "../../interfaces/common/Token_interface.js";
import { Library_interface } from "../../interfaces/common/Library_interface.js";
import { Filter } from "./filters/generic_filter.js";
import { Playlist } from "../../interfaces/common/Playlist_interface.js";
import axios, { Axios } from "axios";
import "dotenv/config";
import { Music } from "../../interfaces/common/Music_interface";

export class Deezer implements Istreaming {
  private readonly app_id: string;
  private readonly app_secret: string;
  private readonly redirect_uri: string;
  private readonly scope: string;
  private filter: Filter;

  constructor(app_id?: string, app_secret?: string, redirect_uri?: string) {
    this.app_id = app_id || process.env.DEEZER_ID;
    this.app_secret = app_secret || process.env.DEEZER_APP_SECRET;
    this.redirect_uri = redirect_uri || process.env.DEEZER_REDIRECT_URI;
    this.scope = process.env.DEEZER_SCOPE;
  }

  public async get_authorization_code(response: Response): Promise<void> {
    // Redirect the user to get the authorization code
    response.redirect(
      "https://connect.deezer.com/oauth/auth.php?" +
        querystring.stringify({
          app_id: this.app_id,
          redirect_uri: this.redirect_uri,
          perms: this.scope,
        }),
    );
  }

  public async get_access_token(
    code: string,
    iaxios: typeof axios,
  ): Promise<Token_interface> {
    const request_body = {
      app_id: this.app_id,
      secret: this.app_secret,
      code: code,
    };

    const response = await iaxios.post(
      "https://connect.deezer.com/oauth/access_token.php",
      querystring.stringify(request_body),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    // deezer returns a string, not a json object
    // WHY DEEZER WHY

    // Regular expression to extract the access token
    const accessTokenRegex = /access_token=([^&]+)/;
    const data = response.data;
    const token = data.match(accessTokenRegex);
    const access_token = token[1];

    if (response.data === "wrong code") {
      throw new Error("Failed to get access token");
    }

    return {
      access_token: access_token,
      expires_in: response.data.expires,
    };
  }

  public async get_library(access_token: string): Promise<Library_interface> {
    const playlists: Playlist[] = await this.get_playlists(access_token, axios);

    // Get musics for each playlist
    let i = 0;
    while (i < playlists.length) {
      playlists[i].musics = await this.get_musics(
        access_token,
        playlists[i].id.toString(),
        axios,
      );
      i++;
    }

    return playlists;
  }

  create_playlist(
    name: string,
    access_token: string,
    axios: any,
  ): Promise<any> {
    return Promise.resolve(undefined);
  }

  // __________________IMPLEMENTATION-SPECIFIC METHODS__________________
  private async get_musics(
    access_token: string,
    playlist_id: string,
    axios: Axios,
  ): Promise<Music[]> {
    const musics = await axios.get(
      `https://api.deezer.com/playlist/${playlist_id}/tracks&access_token=${access_token}`,
    );

    if (musics.status === 401) {
      throw new Error("Token expired");
    }
    if (musics.status !== 200) {
      throw new Error("Failed to get musics");
    }

    // Lazy init
    if (this.filter === undefined) {
      this.filter = new Filter(this);
    }

    return this.filter.filter_music(musics.data.data);
  }

  private async get_playlists(
    access_token: string,
    axios: Axios,
  ): Promise<Playlist[]> {
    const playlists = await axios.get(
      `https://api.deezer.com/user/me/playlists&access_token=${access_token}`,
    );

    if (playlists.data.error) {
      throw new Error("Failed to get playlists");
    }

    if (this.filter === undefined) {
      // Lazy init
      this.filter = new Filter(this);
    }

    return this.filter.filter_playlists(playlists.data.data);
  }
}
