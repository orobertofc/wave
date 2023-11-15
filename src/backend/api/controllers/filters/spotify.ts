import { Ifilter } from "../../../interfaces/services/Filter_class.js";
import { Music } from "../../../interfaces/common/Music_interface.js";
import { Playlist } from "../../../interfaces/common/Playlist_interface.js";
import { Library_interface } from "../../../interfaces/common/Library_interface.js";

export class Spotify_data_filter implements Ifilter {
  filter_music(items: any): Array<Music> {
    const musics: Array<Music> = [];

    items.forEach((item: any) => {
      const music: Music = {
        // Check if track is an episode (podcast) or music
        name: item.episode ? item.episode.name : item.track.name,
        author: item.track.artists[0].name,
      };

      musics.push(music);
    });

    return musics;
  }

  filter_playlists(items: any): Library_interface {
    const library: Library_interface = [];

    items.forEach((item: any) => {
      try {
        const playlist: Playlist = {
          id: item.id,
          name: item.name,
          image:
            item.images && item.images.length > 0
              ? item.images[0].url
              : "default_image_url",
          author: item.owner.display_name,
          amount_of_musics: item.tracks.total,
        };
        library.push(playlist);
      } catch (error) {
        console.error("Error processing playlist:", error);
      }
    });

    return library;
  }
}
