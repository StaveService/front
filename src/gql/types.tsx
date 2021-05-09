import { IArtist, IMusic } from "../interfaces";

export interface IPaginationType {
  currentPage: number;
  limitValue: number;
  totalCount: number;
  totalPages: number;
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
