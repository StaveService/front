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
const state = store.getState();
const { locale } = state.language;
const { headers } = state.currentUser;

export type PostParams<
  T extends IMusic | IAlbum | IBand | IArtist,
  K extends IMusicLink | IAlbumLink | IBandLink | IArtistLink
> = Omit<T, "id" | "bookmarksCount"> & {
  ["link_attributes"]: Omit<K, "id">;
};

export const patchUserNotification = (
  id: number,
  userId: number | undefined
): Promise<AxiosResponse<INotification>> =>
  axios.patch<INotification>(
    `${routes.USERS}/${userId || "undefined"}/notifications/${id}`,
    undefined,
    headers
  );

export const patchUser = (
  id: number | undefined,
  data: IUser
): Promise<AxiosResponse<IUser>> =>
  axios.patch<IUser>(`${routes.USERS}/${id || "undefined"}`, data, headers);

export const deleteUser = (id: number): Promise<AxiosResponse> =>
  axios.delete(`/users/${id}`);
export const postUserRelationship = (
  userId: number
): Promise<AxiosResponse<IUserRelationship>> =>
  axios.post(
    `${routes.USERS}/${userId}${routes.RELATIONSHIPS}`,
    undefined,
    headers
  );
export const deleteUserRelationship = (
  userId: number,
  followedId: number | undefined
): Promise<AxiosResponse> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.RELATIONSHIPS}/${
      followedId || "undefined"
    }`,
    headers
  );

export const postMusic = (
  userId: number | undefined,
  music: PostParams<IMusic, IMusicLink>
): Promise<AxiosResponse<IMusic>> =>
  axios.post<IMusic>(
    `${routes.USERS}/${userId || "undefined"}${routes.MUSICS}`,
    { music, locale },
    headers
  );
export const deleteMusic = (
  userId: number,
  musicId: number
): Promise<AxiosResponse<IMusic>> =>
  axios.delete(`${routes.USERS}/${userId}${routes.MUSICS}/${musicId}`, headers);

export const postAlbum = (
  newAlbum: PostParams<IAlbum, IAlbumLink>
): Promise<AxiosResponse<IAlbum>> =>
  axios.post<IAlbum>(routes.ALBUMS, newAlbum, headers);
export const deleteAlbum = (albumId: number): Promise<AxiosResponse<IAlbum>> =>
  axios.delete(`${routes.ALBUMS}/${albumId}`, headers);

export const postBand = (
  newBand: PostParams<IBand, IBandLink>
): Promise<AxiosResponse<IBand>> =>
  axios.post<IBand>(routes.BANDS, newBand, headers);
export const deleteBand = (bandId: number): Promise<AxiosResponse<IBand>> =>
  axios.delete(`${routes.BANDS}/${bandId}`, headers);

export const postArtist = (
  newArtist: PostParams<IArtist, IArtistLink>
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(routes.ARTISTS, newArtist, headers);
export const deleteArtist = (
  artistId: number
): Promise<AxiosResponse<IArtist>> =>
  axios.delete(`${routes.ARTISTS}/${artistId}`, headers);

export const postIssue = (
  userId: number,
  musicId: number,
  newIssue: IIssue
): Promise<AxiosResponse<IIssue>> =>
  axios.post(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.ISSUES}`,
    newIssue,
    headers
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
      ...headers,
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
    headers
  );

export const postLyristMusic = (
  userId: number,
  musicId: number,
  newLyrist: IArtist
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LYRISTS}`,
    newLyrist,
    headers
  );
export const deleteLyristMusic = (
  userId: number,
  musicId: number,
  lyristId: number
): Promise<AxiosResponse<IArtist>> =>
  axios.delete<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LYRISTS}/${lyristId}`,
    headers
  );

export const postComposerMusic = (
  userId: number,
  musicId: number,
  newComposer: IArtist
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.COMPOSERS}`,
    newComposer,
    headers
  );
export const deleteComposerMusic = (
  userId: number,
  musicId: number,
  composerId: number
): Promise<AxiosResponse<IArtist>> =>
  axios.delete<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.COMPOSERS}/${composerId}`,
    headers
  );

export const postMusicBookmark = (
  userId: number,
  musicId: number
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.post<IMusicBookmark>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}`,
    undefined,
    headers
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
    headers
  );
export const postBandBookmark = (
  bandId: number
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteBandBookmark = (
  bandId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.delete(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}/${bookmarkId || "undefined"}`,
    headers
  );
export const postArtistBookmark = (
  artistId: number
): Promise<AxiosResponse<IArtistBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.ARTISTS}/${artistId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteArtistBookmark = (
  artistId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IArtistBookmark>> =>
  axios.delete(
    `${routes.ARTISTS}/${artistId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    headers
  );
export const postAlbumBookmark = (
  albumId: number
): Promise<AxiosResponse<IAlbumBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.ALBUMS}/${albumId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteAlbumBookmark = (
  albumId: number,
  bookmarkId: number | undefined
): Promise<AxiosResponse<IAlbumBookmark>> =>
  axios.delete(
    `${routes.ALBUMS}/${albumId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    headers
  );

export const patchMusicLink = (
  userId: number,
  musicId: number,
  linkId: number | undefined,
  link: Partial<Omit<IMusicLink, "id">>
): Promise<AxiosResponse<IMusicLink>> =>
  axios.patch(
    `${routes.USERS}/${userId}/${routes.MUSICS}/${musicId}/${routes.LINKS}/${
      linkId || "undefined"
    }`,
    link,
    {
      ...headers,
    }
  );
export const patchBandLink = (
  bandId: number,
  linkId: number | undefined,
  link: Partial<Omit<IBandLink, "id">>
): Promise<AxiosResponse<IBandLink>> =>
  axios.patch(
    `${routes.BANDS}/${bandId}${routes.LINKS}/${linkId || "undefined"}`,
    link,
    {
      ...headers,
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
      ...headers,
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
      ...headers,
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
      ...headers,
    }
  );
export const postContact = (
  newContact: IContact
): Promise<AxiosResponse<IContact>> =>
  axios.post<IContact>(routes.CONTACTS, newContact);
