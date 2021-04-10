export type MenuCardType = "Artist" | "Album" | "Music" | "Band";
export interface ITokenHeaders {
  ["content-type"]: string;
  ["access-token"]: string;
  client: string;
  uid: string;
}
export interface IUser {
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
  musics?: IMusic[];
}
export interface IBand {
  id: number;
  name: string;
  ["itunes_artist_id"]: number;
  artists?: IArtist[];
  albums?: IAlbum[];
  musics?: IMusic[];
}
export interface IMusic {
  id: number;
  title: string;
  ["itunes_track_id"]: number;
  ["created_at"]?: string;
  ["updated_at"]?: string;
  user?: IUser;
  band?: IBand;
  roles?: IRole[];
  albums?: IAlbum[];
  ["music_composers"]?: IArtist[];
  ["music_lyrists"]?: IArtist[];
}
export interface IArtist {
  id: number;
  name: string;
  ["itunes_artist_id"]: number;
  musics?: IMusic[];
  albums?: IAlbum[];
  bands?: IBand[];
}
export interface IAlbum {
  id: number;
  title: string;
  ["itunes_collection_id"]: number;
  ["release_date"]: string;
  musics?: IMusic[];
  artists?: IArtist[];
}
export interface IRole {
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
export interface ISignInFormValues {
  email: string;
  password: string;
}
export interface ISignUpFormValues extends ISignInFormValues {
  nickname: string;
  familyname: string;
  givenname: string;
  ["password_confirmation"]: string;
}
export interface ISignSuccessResponse {
  data: IUser;
}
export interface ISignErrorResponse<T> {
  errors: T;
  success: false;
}
interface IItunesArtwork {
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
}
export interface IItunesMusic extends IItunesArtwork {
  artistName: string;
  collectionArtistId: number;
  collectionArtistViewUrl: string;
  collectionCensoredName: string;
  trackId: number;
  trackViewUrl: string;
  trackCensoredName: string;
  previewUrl: string;
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
