import axios, { AxiosResponse } from "axios";
import {
  IAlbum,
  IArtist,
  IBand,
  IHeaders,
  IMusic,
  ISignInFormValues,
  ISignSuccessResponse,
} from "../interfaces";
import routes from "../constants/routes.json";

export const itunes = axios.create({
  baseURL: "https://itunes.apple.com",
});
export const wiki = axios.create({
  baseURL: "http://ja.wikipedia.org/w/api.php?",
  params: {
    format: "json",
  },
});
switch (process.env.NODE_ENV) {
  case "development":
    axios.defaults.baseURL = "http://localhost:3000";
    break;
  case "production":
    axios.defaults.baseURL = "";
    break;
  default:
    axios.defaults.baseURL = "http://localhost:3000";
}

export const signIn = (
  data: ISignInFormValues
): Promise<AxiosResponse<ISignSuccessResponse>> =>
  axios.post<ISignSuccessResponse>("/auth/sign_in", data);

export const postMusic = (
  userId: number | undefined,
  newMusic: Omit<IMusic, "id">,
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
  newAlbum: Omit<IAlbum, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbum>> =>
  axios.post<IAlbum>(routes.ALBUMS, newAlbum, headers);
export const deleteAlbum = (
  albumId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbum>> =>
  axios.delete(`${routes.ALBUMS}/${albumId}`, headers);

export const postBand = (
  newBand: Omit<IBand, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBand>> =>
  axios.post<IBand>(routes.BANDS, newBand, headers);
export const deleteBand = (
  bandId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBand>> =>
  axios.delete(`${routes.BANDS}/${bandId}`, headers);

export const postArtist = (
  newArtist: Omit<IArtist, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IBand>(routes.BANDS, newArtist, headers);
export const deleteArtist = (
  artistId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.delete(`${routes.BANDS}/${artistId}`, headers);
