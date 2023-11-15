import { Music } from "../common/Music_interface.js";
import { Library_interface } from "../common/Library_interface.js";

export abstract class Ifilter {
  abstract filter_music(items: any): Array<Music>;
  abstract filter_playlists(items: any): Library_interface;
}
