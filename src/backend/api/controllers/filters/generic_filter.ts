import { Ifilter } from "../../../interfaces/services/Filter_class.js";
import { Istreaming } from "../../../interfaces/services/Streaming_class.js";
import { filter_factory } from "./filter_factory.js";
import { Music } from "../../../interfaces/common/Music_interface.js";
import { Library_interface } from "../../../interfaces/common/Library_interface.js";

export class Filter implements Ifilter {
  private filter: Ifilter;
  constructor(calling_class: Istreaming) {
    this.filter = filter_factory(calling_class);
  }
  filter_music(items: any): Array<Music> {
    return this.filter.filter_music(items);
  }

  filter_playlists(items: any): Library_interface {
    return this.filter.filter_playlists(items);
  }
}
