import {User} from './User';
import {Playlist} from './Playlist';
import {Tag} from './Tag';

export interface Song {
  idSong?: number;
  nameSong?: string;
  descriptionSong?: string;
  mp3UrlSong?: string;
  avatarUrlSong?: string;
  user?: User;

  numberOfViewSong?: number;
  dateCreateSong?: string;
  playlists?: Playlist[];
  tags?: Tag[];

}
