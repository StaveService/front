import { AlphaTabApi, model, synth } from "@coderline/alphatab";
// eslint-disable-next-line import/no-cycle
import { ITokenHeaders } from "./slices/currentUser/currentUser";

export type MenuCardType = "Artist" | "Album" | "Music" | "Band";

export interface IHeaders {
  headers: ITokenHeaders;
}
export interface INotification {
  id: number;
  recipientType: string;
  recipientId: number;
  type: "UserRelationshipNotification" | "MusicBookmarkNotification";
  params: {
    userRelationship: IUserRelationship;
    musicBookmark: IMusicBookmark;
  };
  readAt: string;
  createdAt: string;
  updatedAt: string;
}
export interface IUser
  extends IMusicsType,
    INotificationsType,
    IFollowersType,
    IFollowingType,
    IBookmarkedMusicsType,
    IBookmarkedBandsType,
    IBookmarkedAlbumsType,
    IBookmarkedArtistsType {
  ["allow_password_change"]?: false;
  email: string;
  id: number;
  image: { url: string | null };
  nickname: string;
  familyname: string;
  givenname: string;
  birthday: string | null;
  gender: number | null;
  introduction: string | null;
  ["created_at"]: string;
  link: IUserLink;
  followed?: IUserRelationship;
  followingCount: number;
  followersCount: number;
}
export interface IUserLink {
  id: number;
  twitter: string;
}
export interface IUserRelationship {
  id: number;
  followedId: number;
  followerId: number;
  followed: IUser;
  follower: IUser;
}
export interface IBand extends IMusicsType, IAlbumsType {
  id: number;
  name: string;
  bookmark: IBandBookmark | undefined;
  bookmarksCount: number;
  artists: IArtist[];
  link: IBandLink;
  localed: boolean;
}
export interface IBandLink {
  id: number;
  itunes: number;
  twitter: string;
  wikipedia: number;
  spotify: string;
}
export interface IMusic {
  id: number;
  title: string;
  ["created_at"]?: string;
  ["updated_at"]?: string;
  bookmark?: IMusicBookmark;
  bookmarksCount: number;
  user: IUser;
  band: IBand | null;
  artistMusics: IArtistMusic[] | null;
  albums: IAlbum[] | null;
  composers: IArtist[] | null;
  lyrists: IArtist[] | null;
  link: IMusicLink;
  rootTree: ITree[] | null;
  tree: ITree[] | null;
  blob: string;
  score: string;
  scoreExist: boolean;
  localed: boolean;
}
export interface ITree {
  name: string;
  oid: string;
  filemode: string;
  type: string;
}
export interface IMusicLink {
  id: number;
  itunes: number | null;
  musixmatch: number | null;
  spotify: string | null;
}
export interface IArtist extends IMusicsType, IAlbumsType {
  id: number;
  name: string;
  bookmark?: IArtistBookmark;
  bookmarksCount: number;
  bands?: IBand[];
  link: IArtistLink;
  localed: boolean;
}
export interface IArtistLink {
  id: number;
  itunes: number | null;
  spotify: string | null;
  twitter: string | null;
  wikipedia: number | null;
}
export interface IAlbum extends IMusicsType {
  id: number;
  title: string;
  bookmark?: IAlbumBookmark;
  bookmarksCount: number;
  artists?: IArtist[];
  link: IAlbumLink;
  localed: boolean;
}
export interface IAlbumLink {
  id: number;
  itunes: number;
  spotify: string;
}
export interface IIssue {
  id: number;
  title: string;
  description: string;
  music?: IMusic;
  user?: IUser;
}
export interface IContact {
  email: string;
  description: string;
}
export interface IArtistMusic {
  id: number;
  ["artist_id"]: number;
  role: string | number;
  artist: IArtist;
}
export interface IAlbumMusic {
  id: number;
  ["album_id"]: number;
  ["music_id"]: number;
  album: IAlbum;
}
export interface IBandAlbum {
  id: number;
  ["band_id"]: number;
  ["album_id"]: number;
  album: IAlbum;
}
export interface IArtistBand {
  id: number;
  ["artist_id"]: number;
  ["band_id"]: number;
  artist: IArtist;
}
export interface IArtistAlbum {
  id: number;
  ["artist_id"]: number;
  ["album_id"]: number;
  artist: IArtist;
}
export interface IMusicBookmark {
  id: number;
  user: IUser;
  music: IMusic;
}
export interface IBandBookmark {
  id: number;
}
export interface IArtistBookmark {
  id: number;
}
export interface IAlbumBookmark {
  id: number;
}
export interface IPaginationType {
  currentPage: number;
  limitValue: number;
  totalCount: number;
  totalPages: number;
}
export interface IIndexType<Data> {
  data: Data[];
  pagination: IPaginationType;
}
export interface IUserType {
  user: IUser;
}
export interface IUsersType {
  users: IIndexType<IUser>;
}
export interface INotificationsType {
  notifications: IIndexType<INotification> & { notificationExist: boolean };
}
export interface IFollowersType {
  followers: IIndexType<IUser>;
}
export interface IFollowingType {
  following: IIndexType<IUser>;
}
export interface IMusicType {
  music: IMusic;
}
export interface IMusicsType {
  musics: IIndexType<IMusic>;
}
export interface IBookmarkedMusicsType {
  bookmarkedMusics: IIndexType<IMusic>;
}
export interface IArtistType {
  artist: IArtist;
}
export interface IArtistsType {
  artists: IIndexType<IArtist>;
}
export interface IBookmarkedArtistsType {
  bookmarkedArtists: IIndexType<IArtist>;
}
export interface IIssueType {
  issue: IIssue;
}
export interface IIssuesType {
  issues: IIndexType<IIssue>;
}
export interface IBandType {
  band: IBand;
}
export interface IBandsType {
  bands: IIndexType<IBand>;
}
export interface IBookmarkedBandsType {
  bookmarkedBands: IIndexType<IBand>;
}
export interface IAlbumType {
  album: IAlbum;
}
export interface IAlbumsType {
  albums: IIndexType<IAlbum>;
}
export interface IBookmarkedAlbumsType {
  bookmarkedAlbums: IIndexType<IAlbum>;
}

interface IItunesArtwork {
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
}
export interface IItunesMusic extends IItunesArtwork {
  artistName: string;
  artistViewUrl: string;
  collectionArtistId: number;
  collectionArtistViewUrl: string;
  collectionCensoredName: string;
  trackId: number;
  trackViewUrl: string;
  trackCensoredName: string;
  previewUrl: string;
  viewURL: string;
  releaseDate: string;
}
export interface IItunesArtist {
  amgArtistId: number;
  artistId: number;
  artistLinkUrl: string;
  artistName: string;
  artistType: "Artist";
  primaryGenreId: 21;
  wrapperType: string;
}
export interface IItunesAlbum extends IItunesArtwork {
  amgArtistId: number;
  artistId: number;
  artistName: string;
  artistViewUrl: string;
  collectionCensoredName: string;
  collectionExplictness: string;
  collectionId: number;
  collectionName: string;
  collectionPrice: number;
  collectionType: "Album";
  collectionViewUrl: string;
  copyright: string;
  country: "USA";
  currency: "USD";
  primaryGenreName: "Pop";
  releaseDate: string;
  trackCount: number;
  wrapperType: "collection";
}
export interface IItunesResponse<T> {
  resultCount: number;
  results: T[];
}
export interface IWikipediaResponse<
  T extends IWikipediaSearch | IWikipediaGet
> {
  batchcomplete: "";
  continue: { sroffset: number };
  query: T;
}
export interface IWikipediaSearch {
  search: IWikipedia[];
  searchinfo: { totalhits: number };
}
export interface IWikipediaGet {
  pages: {
    [key: number]: IWikipedia;
  };
}
export interface IWikipedia {
  ns: number;
  pageid: number;
  size: number;
  snippet: string;
  timestamp: string;
  title: string;
  extract: string;
}
export interface IAlphaTab {
  AlphaTabApi: typeof AlphaTabApi;
  synth: typeof synth;
  model: typeof model;
}

export interface IMusixmatchResponse<T extends ISearchTrack | IGetTrackLyric> {
  message: {
    body: T;
    header: {
      available: number;
      ["execute_time"]: number;
      ["status_code"]: number;
    };
  };
}
export interface ISearchTrack {
  ["track_list"]: IMusixmatchTrack[];
}
export interface IGetTrackLyric {
  lyrics: {
    explict: number;
    ["lyrics_body"]: string;
    ["lyrics_copyright"]: string;
    ["lyrics_id"]: number;
  };
}
export interface IMusixmatchTrack {
  track: {
    ["album_id"]: number;
    ["album_name"]: string;
    ["artist_id"]: number;
    ["artist_name"]: string;
    ["commontrack_id"]: number;
    explicit: number;
    ["has_lyrics"]: number;
    ["has_richsync"]: number;
    ["has_subtitles"]: number;
    instrumental: number;
    ["num_favourite"]: number;
    restricted: number;
    ["track_edit_url"]: string;
    ["track_id"]: number;
    ["track_name"]: string;
    ["track_share_url"]: string;
  };
}
export interface ISpotifyToken {
  ["access_token"]: string;
  ["expires_in"]: 3600;
  ["refresh_token"]: string;
  scope: string;
  ["token_type"]: string;
}

export type ISpotifySearchTypes =
  | "album"
  | "artist"
  | "playlist"
  | "track"
  | "show";
export type ISpotifyKeyTypes = "artists" | "tracks" | "albums";
export type ISpotifyTypes = ISpotifyArtist | ISpotifyTrack | ISpotifyAlbum;
interface ISpotifyImage {
  height: number;
  width: number;
  url: string;
}
export type ISpotifySearchResponse<T extends ISpotifyTypes> = {
  [key in ISpotifyKeyTypes]: {
    href: string;
    items: T[];
    limit: number;
    next: number;
    offset: number;
    previous: number;
    total: number;
  };
};
export interface ISpotifyArtist {
  ["external_urls"]: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: ISpotifyImage[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}
export interface ISpotifyTrack {
  artists: ISpotifyArtist[];
  album: ISpotifyAlbum;
  ["available_markets"]: string[];
  ["disc_number"]: number;
  ["duration_ms"]: number;
  explict: boolean;
  ["external_urls"]: {
    spotify: string;
  };
  ["external_ids"]: { isrc: string };
  href: string;
  id: string;
  ["is_local"]: boolean;
  name: string;
  popularity: number;
  ["preview_url"]: string;
  ["track_number"]: number;
  type: "track";
  uri: string;
}
export interface ISpotifyAlbum {
  ["album_type"]: "album";
  artists: ISpotifyArtist[];
  ["available_markets"]: string[];
  ["external_urls"]: {
    spotify: string;
  };
  href: string;
  id: string;
  images: ISpotifyImage[];
  name: string;
  ["release_date"]: string;
  ["release_date_precision"]: string;
  ["track_tracks"]: number;
  type: "album";
  uri: string;
}
