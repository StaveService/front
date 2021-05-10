import { IArtist, IBand, IMusic, IUser } from "../interfaces";

export interface IPaginationType {
  currentPage: number;
  limitValue: number;
  totalCount: number;
  totalPages: number;
}
export interface IUsersType {
  users: {
    data: IUser[];
    pagination: IPaginationType;
  };
}
export interface IMusicsType {
  musics: {
    data: IMusic[];
    pagination: IPaginationType;
  };
}
export interface IMusicType {
  music: IMusic;
}
export interface IArtistsType {
  artists: {
    data: IArtist[];
    pagination: IPaginationType;
  };
}
export interface IBandsType {
  bands: {
    data: IBand[];
    pagination: IPaginationType;
  };
}
