import { IMusic } from "../interfaces";

export interface IPaginationType {
  currentPage: number;
  limitValue: number;
  totalCount: number;
  totalPages: number;
}
export interface IMusicsType {
  musics: {
    data: IMusic[];
    pagenation: IPaginationType;
  };
}
