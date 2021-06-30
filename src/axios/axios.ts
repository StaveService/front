import axios, { AxiosResponse } from "axios";
import {
  IAlbum,
  IAlbumLink,
  IAlbumMusic,
  IArtist,
  IArtistBookmark,
  IArtistLink,
  IBand,
  IBandBookmark,
  IBandLink,
  IHeaders,
  IIssue,
  IMusic,
  IMusicBookmark,
  IMusicLink,
  ISignInFormValues,
  ISignSuccessResponse,
  ISignUpFormValues,
  IUserLink,
  IUserRelationship,
} from "../interfaces";
import routes from "../constants/routes.json";

export type PostParams<
  T extends IMusic | IAlbum | IBand | IArtist,
  K extends IMusicLink | IAlbumLink | IBandLink | IArtistLink
> = Omit<T, "id" | "bookmarksCount"> & {
  ["link_attributes"]: Omit<K, "id">;
};
declare module "axios" {
  export interface AxiosRequestConfig {
    "Key-inflection"?: string;
  }
}

switch (process.env.NODE_ENV) {
  case "development":
    axios.defaults.baseURL = "http://localhost:3000";
    break;
  case "production":
    axios.defaults.baseURL = "https://stave-back.herokuapp.com/";
    break;
  default:
    axios.defaults.baseURL = "http://localhost:3000";
}

export const signIn = (
  data: ISignInFormValues
): Promise<AxiosResponse<ISignSuccessResponse>> =>
  axios.post<ISignSuccessResponse>("/auth/sign_in", data);
export const signUp = (
  data: ISignUpFormValues
): Promise<AxiosResponse<ISignSuccessResponse>> =>
  axios.post<ISignSuccessResponse>("/auth", data, {
    "Key-inflection": "camel",
  });
export const deleteUser = (id: number): Promise<AxiosResponse> =>
  axios.delete(`/users/${id}`);
export const postUserRelationship = (
  userId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IUserRelationship>> =>
  axios.post(`${routes.USERS}/${userId}${routes.RELATIONSHIPS}`, undefined, {
    ...headers,
  });
export const deleteUserRelationship = (
  userId: number,
  followedId: number | undefined,
  headers: IHeaders | undefined
): Promise<AxiosResponse> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.RELATIONSHIPS}/${
      followedId || "undefined"
    }`,
    {
      ...headers,
    }
  );

export const postMusic = (
  userId: number | undefined,
  newMusic: PostParams<IMusic, IMusicLink>,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusic>> =>
  axios.post<IMusic>(
    `${routes.USERS}/${userId || "undefined"}${routes.MUSICS}`,
    newMusic,
    headers
  );
export const deleteMusic = (
  userId: number,
  musicId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusic>> =>
  axios.delete(`${routes.USERS}/${userId}${routes.MUSICS}/${musicId}`, headers);

export const postAlbum = (
  newAlbum: PostParams<IAlbum, IAlbumLink>,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbum>> =>
  axios.post<IAlbum>(routes.ALBUMS, newAlbum, headers);
export const deleteAlbum = (
  albumId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbum>> =>
  axios.delete(`${routes.ALBUMS}/${albumId}`, headers);

export const postBand = (
  newBand: PostParams<IBand, IBandLink>,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBand>> =>
  axios.post<IBand>(routes.BANDS, newBand, headers);
export const deleteBand = (
  bandId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBand>> =>
  axios.delete(`${routes.BANDS}/${bandId}`, headers);

export const postArtist = (
  newArtist: PostParams<IArtist, IArtistLink>,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(routes.ARTISTS, newArtist, headers);
export const deleteArtist = (
  artistId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.delete(`${routes.ARTISTS}/${artistId}`, headers);

export const postIssue = (
  userId: number,
  musicId: number,
  newIssue: IIssue,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IIssue>> =>
  axios.post(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.ISSUES}`,
    newIssue,
    headers
  );

export const postAlbumMusic = (
  userId: number,
  musicId: number,
  newAlbum: Omit<IAlbum, "id">,
  headers: IHeaders | undefined
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
  albumId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbumMusic>> =>
  axios.delete<IAlbumMusic>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.ALBUMS}/${albumId}`,
    headers
  );

export const postLyristMusic = (
  userId: number,
  musicId: number,
  newLyrist: IArtist,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LYRISTS}`,
    newLyrist,
    headers
  );
export const deleteLyristMusic = (
  userId: number,
  musicId: number,
  lyristId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.delete<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.LYRISTS}/${lyristId}`,
    headers
  );

export const postComposerMusic = (
  userId: number,
  musicId: number,
  newComposer: IArtist,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.COMPOSERS}`,
    newComposer,
    headers
  );
export const deleteComposerMusic = (
  userId: number,
  musicId: number,
  composerId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.delete<IArtist>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.COMPOSERS}/${composerId}`,
    headers
  );

export const postMusicBookmark = (
  userId: number,
  musicId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteMusicBookmark = (
  userId: number,
  musicId: number,
  bookmarkId: number | undefined,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    headers
  );
export const postBandBookmark = (
  bandId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteBandBookmark = (
  bandId: number,
  bookmarkId: number | undefined,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.delete(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}/${bookmarkId || "undefined"}`,
    headers
  );
export const postArtistBookmark = (
  artistId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtistBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.ARTISTS}/${artistId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteArtistBookmark = (
  artistId: number,
  bookmarkId: number | undefined,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtistBookmark>> =>
  axios.delete(
    `${routes.ARTISTS}/${artistId}${routes.BOOKMARKS}/${
      bookmarkId || "undefined"
    }`,
    headers
  );

export const patchMusicLink = (
  userId: number,
  musicId: number,
  linkId: number | undefined,
  link: Partial<Omit<IMusicLink, "id">>,
  headers: IHeaders | undefined
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
  link: Partial<Omit<IBandLink, "id">>,
  headers: IHeaders | undefined
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
  link: Partial<Omit<IArtistLink, "id">>,
  headers: IHeaders | undefined
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
  link: Partial<Omit<IArtistLink, "id">>,
  headers: IHeaders | undefined
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
  twitterId: string,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IUserLink>> =>
  axios.patch(
    `${routes.USERS}/${userId}${routes.LINKS}/${linkId || "undefined"}`,
    { twitter: twitterId },
    {
      ...headers,
    }
  );
