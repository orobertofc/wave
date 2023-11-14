import { Music } from "./Music_interface.js";

export interface Playlist {
  id: string;
  name: string;
  image: string;
  musics?: Music[];
  author: string;
  amount_of_musics: number;
}
