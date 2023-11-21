import { Ifilter } from "../../../interfaces/services/Filter_class.js";
import { Music } from "../../../interfaces/common/Music_interface.js";
import { Playlist } from "../../../interfaces/common/Playlist_interface.js";
import { Library_interface } from "../../../interfaces/common/Library_interface.js";

export class Deezer_data_filter implements Ifilter {
  filter_music(items: any): Array<Music> {
    const musics: Array<Music> = [];

    items.forEach((item: any) => {
      const music: Music = {
        name: item.title,
        author: item.artist.name,
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
          name: item.title,
          image: item.picture_medium,
          author: item.creator.name,
          amount_of_musics: item.nb_tracks,
        };
        library.push(playlist);
      } catch (error) {
        console.error("Error processing playlist:", error);
      }
    });

    return library;
  }
}
