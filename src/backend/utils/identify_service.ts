import { Istreaming } from "../interfaces/services/Streaming_class";
import { Spotify } from "../api/controllers/Spotify";

export function identify_service(service: Istreaming): string {
  switch (service) {
    // @ts-ignore
    case Spotify:
      return "spotify";
    default:
      throw new Error("Invalid service");
  }
}
