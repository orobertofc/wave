import { Istreaming } from "../../../interfaces/services/Streaming_class.js";
import { Ifilter } from "../../../interfaces/services/Filter_class.js";
import { Spotify } from "../Spotify.js";
import { Spotify_data_filter } from "./spotify.js";
import { Deezer } from "../Deezer.js";
import { Deezer_data_filter } from "./deezer.js";

export function filter_factory(service_class: Istreaming): Ifilter {
  if (service_class instanceof Spotify) {
    return new Spotify_data_filter();
  }
  if (service_class instanceof Deezer) {
    return new Deezer_data_filter();
  }

  //   default error
  throw new Error("Service not found by filter factory");
}
