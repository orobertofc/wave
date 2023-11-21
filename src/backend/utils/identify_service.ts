import { Istreaming } from "../interfaces/services/Streaming_class.js";
import { Spotify } from "../api/controllers/Spotify.js";
import { Deezer } from "../api/controllers/Deezer.js";

export function identify_service(service: Istreaming): string {
  if (service instanceof Spotify) {
    return "spotify";
  }
  if (service instanceof Deezer) {
    return "deezer";
  }
  throw new Error("Service not found");
}
