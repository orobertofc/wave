import { Music } from "./Music_interface.js";

export interface Playlist {
  name: string;
  musics: Music[];
  author: string;
  amount_of_musics: number;
}
