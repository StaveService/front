import axios, { AxiosResponse } from "axios";
import {
  IAlbum,
  IAlbumBookmark,
  IAlbumLink,
  IAlbumMusic,
  IArtist,
  IArtistBookmark,
  IArtistLink,
  IBand,
  IBandBookmark,
  IBandLink,
  IContact,
  IIssue,
  IMusic,
  IMusicBookmark,
  IMusicLink,
  IUser,
  IUserLink,
  IUserRelationship,
  INotification,
} from "../interfaces";
import routes from "../constants/routes.json";
import baseURL from "../constants/baseURL";
import { store } from "../store";

axios.defaults.baseURL = baseURL;
const getLocale = () => store.getState().language.locale;
const getHeaders = () => store.getState().currentUser.headers;

export interface IMusicParams {
  title: string;
  ["link_attributes"]?: Omit<IMusicLink, "id">;
}
export interface IAlbumParams {
  title: string;
  ["link_attributes"]?: Omit<IAlbumLink, "id">;
}
export interface IBandParams {
  name: string;
  ["link_attributes"]?: Omit<IBandLink, "id">;
}
export interface IArtistParams {
  name: string;
  ["link_attributes"]?: Omit<IArtistLink, "id">;
}
export interface IUserParams {
  email: string;
  nickname: string;
  familyname: string;
  givenname: string;
  introduction: string | null;
}
export const patchUserNotification = (
  id: number,
  userId: number | undefined
): Promise<AxiosResponse<INotification>> =>
  axios.patch<INotification>(
    `${routes.USERS}/${userId || "undefined"}/notifications/${id}`,
    undefined,
    getHeaders()
  );

export const patchUser = (
  id: number | undefined,
  data: IUserParams
): Promise<AxiosResponse<IUser>> =>
  axios.patch<IUser>(
    `${routes.USERS}/${id || "undefined"}`,
    data,
    getHeaders()
  );

export const deleteUser = (id: number): Promise<AxiosResponse> =>
  axios.delete(`/users/${id}`, getHeaders());
export const postUserRelationship = (
  userId: number
): Promise<AxiosResponse<IUserRelationship>> =>
  axios.post(
    `${routes.USERS}/${userId}${routes.RELATIONSHIPS}`,
    undefined,
    getHeaders()
  );
export const deleteUserRelationship = (
  userId: number,
  followedId: number | undefined
): Promise<AxiosResponse> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.RELATIONSHIPS}/${
      followedId || "undefined"
    }`,
    getHeaders()
  );

export const postMusic = (
  userId: number | undefined,
  music: IMusicParams
): Promise<AxiosResponse<IMusic>> =>
  axios.post<IMusic>(
    `${routes.USERS}/${userId || "undefined"}${routes.MUSICS}`,
    { music, locale: getLocale() },
    getHeaders()
  );
export const patchMusic =
  (userId: number | undefined) =>
  (musicId: number, music: IMusicParams): Promise<AxiosResponse<IMusic>> =>
    axios.patch<IMusic>(
      `${routes.USERS}/${userId || "undefined"}${routes.MUSICS}/${musicId}`,
      { music, locale: getLocale() },
      getHeaders()
    );
export const deleteMusic = (
  userId: number,
  musicId: number
): Promise<AxiosResponse<IMusic>> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}`,
    getHeaders()
  );

export const postAlbum = (
  album: IAlbumParams
): Promise<AxiosResponse<IAlbum>> =>
  axios.post<IAlbum>(
    routes.ALBUMS,
    { album, locale: getLocale() },
    getHeaders()
  );
export const patchAlbum = (
  albumId: number,
  album: IAlbumParams
): Promise<AxiosResponse<IAlbum>> =>
  axios.patch<IAlbum>(
    `${routes.ALBUMS}/${albumId}`,
    {
      album,
      locale: getLocale(),
    },
    getHeaders()
  );
export const deleteAlbum = (albumId: number): Promise<AxiosResponse<IAlbum>> =>
  axios.delete(`${routes.ALBUMS}/${albumId}`, getHeaders());

export const postBand = (band: IBandParams): Promise<AxiosResponse<IBand>> =>
  axios.post<IBand>(routes.BANDS, { band, locale: getLocale() }, getHeaders());
export const patchBand = (
  bandId: number,
  band: IBandParams
): Promise<AxiosResponse<IBand>> =>
  axios.patch<IBand>(
    `${routes.BANDS}/${bandId}`,
    {
      band,
      locale: getLocale(),
    },
    getHeaders()
  );
export const deleteBand = (bandId: number): Promise<AxiosResponse<IBand>> =>
  axios.delete(`${routes.BANDS}/${bandId}`, getHeaders());

export const postArtist = (
  artist: IArtistParams
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    routes.ARTISTS,
    { artist, locale: getLocale() },
    getHeaders()
  );
export const patchArtist = (
  artistId: number,
  artist: IArtistParams
): Promise<AxiosResponse<IArtist>> =>
  axios.patch<IArtist>(
    `${routes.ARTISTS}/${artistId}`,
    {
      artist,
      locale: getLocale(),
    },
    getHeaders()
  );
export const deleteArtist = (
  artistId: number
): Promise<AxiosResponse<IArtist>> =>
  axios.delete(`${routes.ARTISTS}/${artistId}`, getHeaders());

export const postIssue = (
  userId: number,
  musicId: number,
  newIssue: Omit<IIssue, "id">
): Promise<AxiosResponse<IIssue>> =>
  axios.post(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.ISSUES}`,
    newIssue,
    getHeaders()
  );

export const postAlbumMusic = (
  userId: number,
  musicId: number,
  newAlbum: Omit<IAlbum, "id">
): Promise<AxiosResponse<IAlbumMusic>> =>
  axios.post<IAlbumMusic>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.ALBUMS}`,
    newAlbum,
    {
      ...getHeaders(),
      "Key-inflection": "camel",
    }
  );
export const deleteAlbumMusic = (
  userId: number,
  musicId: number,
  albumId: number
): Promise<AxiosResponse<IAlbumMusic>> =>
  axios.delete<IAlbumMusic>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.ALBUMS}/${albumId}`,
    getHeaders()
  );

export const postLyristMusic = (
  userId: number,
  musicId: number,
  newLyrist: IArtist
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LYRISTS}`,
    newLyrist,
    getHeaders()
  );
export const deleteLyristMusic = (
  userId: number,
  musicId: number,
  lyristId: number
): Promise<AxiosResponse<IArtist>> =>
  axios.delete<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LYRISTS}/${lyristId}`,
    getHeaders()
  );

export const postComposerMusic = (
  userId: number,
  musicId: number,
  newComposer: IArtist
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.COMPOSERS}`,
    newComposer,
    getHeaders()
  );
export const deleteComposerMusic = (
  userId: number,
  musicId: number,
  composerId: number
): Promise<AxiosResponse<IArtist>> =>
  axios.delete<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.COMPOSERS}/${composerId}`,
    getHeaders()
  );

export const postMusicBookmark = (
  userId: number,
  musicId: number
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.post<IMusicBookmark>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}`,
    undefined,
    getHeaders()
  );
export const deleteMusicBookmark = (
  userId: number,
  musicId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    getHeaders()
  );
export const postBandBookmark = (
  bandId: number
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}`,
    undefined,
    getHeaders()
  );
export const deleteBandBookmark = (
  bandId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.delete(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}/${bookmarkId || "undefined"}`,
    getHeaders()
  );
export const postArtistBookmark = (
  artistId: number
): Promise<AxiosResponse<IArtistBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.ARTISTS}/${artistId}${routes.BOOKMARKS}`,
    undefined,
    getHeaders()
  );
export const deleteArtistBookmark = (
  artistId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IArtistBookmark>> =>
  axios.delete(
    `${routes.ARTISTS}/${artistId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    getHeaders()
  );
export const postAlbumBookmark = (
  albumId: number
): Promise<AxiosResponse<IAlbumBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.ALBUMS}/${albumId}${routes.BOOKMARKS}`,
    undefined,
    getHeaders()
  );
export const deleteAlbumBookmark = (
  albumId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IAlbumBookmark>> =>
  axios.delete(
    `${routes.ALBUMS}/${albumId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    getHeaders()
  );

export const patchMusicLink = (
  userId: number,
  musicId: number,
  linkId: number | undefined,
  link: Partial<Omit<IMusicLink, "id">>
): Promise<AxiosResponse<IMusicLink>> =>
  axios.patch(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LINKS}/${
      linkId || "undefined"
    }`,
    link,
    {
      ...getHeaders(),
    }
  );
export const patchBandLink = (
  bandId: number,
  linkId: number | undefined,
  link: Partial<Omit<IBandLink, "id">>
): Promise<AxiosResponse<IBandLink>> =>
  axios.patch(
    `${routes.BANDS}/${bandId}${routes.LINKS}/${linkId || "undefined"}`,
    { band_link: link, locale: getLocale() },
    {
      ...getHeaders(),
    }
  );
export const patchArtistLink = (
  artistId: number,
  linkId: number | undefined,
  link: Partial<Omit<IArtistLink, "id">>
): Promise<AxiosResponse<IArtistLink>> =>
  axios.patch(
    `${routes.ARTISTS}/${artistId}${routes.LINKS}/${linkId || "undefined"}`,
    link,
    {
      ...getHeaders(),
    }
  );
export const patchAlbumLink = (
  albumId: number,
  linkId: number | undefined,
  link: Partial<Omit<IArtistLink, "id">>
): Promise<AxiosResponse<IAlbumLink>> =>
  axios.patch(
    `${routes.ALBUMS}/${albumId}${routes.LINKS}/${linkId || "undefined"}`,
    link,
    {
      ...getHeaders(),
    }
  );

export const patchUserLink = (
  userId: number,
  linkId: number | undefined,
  twitterId: string
): Promise<AxiosResponse<IUserLink>> =>
  axios.patch(
    `${routes.USERS}/${userId}${routes.LINKS}/${linkId || "undefined"}`,
    { twitter: twitterId },
    {
      ...getHeaders(),
    }
  );
export const postContact = (
  newContact: IContact
): Promise<AxiosResponse<IContact>> =>
  axios.post<IContact>(routes.CONTACTS, newContact);
