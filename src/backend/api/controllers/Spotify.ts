import { Istreaming } from "../../interfaces/services/Streaming_class.js";
import * as process from "process";
import { Response } from "express";
import * as querystring from "querystring";
import { Token_interface } from "../../interfaces/common/Token_interface.js";
import { Library_interface } from "../../interfaces/common/Library_interface.js";
import { Filter } from "./filters/generic_filter.js";
import { Playlist } from "../../interfaces/common/Playlist_interface.js";
import { Music } from "../../interfaces/common/Music_interface.js";
import axios, { Axios } from "axios";
import "dotenv/config";

export class Spotify implements Istreaming {
  private readonly client_id: string;
  private readonly client_secret: string;
  private readonly redirect_uri: string;
  private readonly scope: string;
  private filter: Filter;

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
    axios: Axios,
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

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(request_body),
      { headers: request_headers },
    );

    if (response.status !== 200) {
      throw new Error("Failed to get access token");
    }

    // Return a Promise to handle the asynchronous operation
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };
  }

  async refresh_access_token(
    refresh_token: string,
    axios: Axios,
  ): Promise<Token_interface> {
    const request_body = {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: this.client_id,
    };

    // Auth header for identifying our app to Spotify
    const request_headers = {
      Authorization: `Basic ${Buffer.from(
        `${this.client_id}:${this.client_secret}`,
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify(request_body),
      { headers: request_headers },
    );

    if (response.status !== 200) {
      throw new Error("Failed to refresh access token");
    }

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };
  }

  create_playlist(
    access_token: string,
    name: string,
    needle: any,
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async get_library(access_token: string): Promise<Library_interface> {
    const playlists: Playlist[] = await this.get_playlists(access_token, axios);

    // Get musics for each playlist
    let i = 0;
    while (i < playlists.length) {
      playlists[i].musics = await this.get_musics(
        access_token,
        playlists[i].id,
        axios,
      );
      i++;
    }

    return playlists;
  }

  // __________________IMPLEMENTATION-SPECIFIC METHODS__________________
  private async get_playlists(
    access_token: string,
    axios: Axios,
  ): Promise<Playlist[]> {
    const playlists = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (playlists.status === 401) {
      throw new Error("Token expired");
    }
    if (playlists.status !== 200) {
      throw new Error("Failed to get playlists");
    }

    // Lazy init
    if (this.filter === undefined) {
      this.filter = new Filter(this);
    }

    return this.filter.filter_playlists(playlists.data.items);
  }

  private async get_musics(
    access_token: string,
    playlist_id: string,
    axios: Axios,
  ): Promise<Music[]> {
    const musics = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
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

    return this.filter.filter_music(musics.data.items);
  }
}
