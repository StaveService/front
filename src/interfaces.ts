import { AlphaTabApi, model, synth } from "@coderline/alphatab";

export type MenuCardType = "Artist" | "Album" | "Music" | "Band";
export interface IHeaders {
  headers: ITokenHeaders;
}
export interface ITokenHeaders {
  ["content-type"]: string;
  ["access-token"]: string;
  client: string;
  uid: string;
}
export interface IUser
  extends IMusicsType,
    IBookmarkedMusicsType,
    IBookmarkedBandsType,
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
}
export interface IBand extends IMusicsType, IAlbumsType {
  id: number;
  name: string;
  bookmark?: IBandBookmark;
  artists?: IArtist[];
  bandLink?: IBandLink;
}
export interface IBandLink {
  itunes: number;
}
export interface IMusic {
  id: number;
  title: string;
  tab: string;
  ["created_at"]?: string;
  ["updated_at"]?: string;
  bookmark?: IMusicBookmark;
  user?: IUser;
  band?: IBand;
  artistMusics?: IArtistMusic[];
  albums?: IAlbum[];
  composers?: IArtist[];
  lyrists?: IArtist[];
  musicLink?: IMusicLink;
}
export interface IMusicLink {
  itunes: number;
  twitter: string;
}
export interface IArtist extends IMusicsType, IAlbumsType {
  id: number;
  name: string;
  bookmark?: IArtistBookmark;
  bands?: IBand[];
  artistLink?: IArtistLink;
}
export interface IArtistLink {
  itunes: number;
}
export interface IAlbum extends IMusicsType {
  id: number;
  title: string;
  artists?: IArtist[];
  albumLink?: IAlbumLink;
}
export interface IAlbumLink {
  itunes: number;
}
export interface IIssue {
  id: number;
  title: string;
  description: string;
  music?: IMusic;
  user?: IUser;
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
}
export interface IBandBookmark {
  id: number;
}
export interface IArtistBookmark {
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
export interface IMusicType {
  music: IMusic;
}
export interface IMusicsType {
  musics?: IIndexType<IMusic>;
}
export interface IBookmarkedMusicsType {
  bookmarkedMusics?: IIndexType<IMusic>;
}
export interface IArtistType {
  artist: IArtist;
}
export interface IArtistsType {
  artists?: IIndexType<IArtist>;
}
export interface IBookmarkedArtistsType {
  bookmarkedArtists?: IIndexType<IArtist>;
}
export interface IIssueType {
  issues?: IIndexType<IIssue>;
}
export interface IBandType {
  band: IBand;
}
export interface IBandsType {
  bands?: IIndexType<IBand>;
}
export interface IBookmarkedBandsType {
  bookmarkedBands?: IIndexType<IBand>;
}
export interface IAlbumType {
  album: IAlbum;
}
export interface IAlbumsType {
  albums?: IIndexType<IAlbum>;
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
export interface IAlphaTab {
  AlphaTabApi: typeof AlphaTabApi;
  synth: typeof synth;
  model: typeof model;
}
