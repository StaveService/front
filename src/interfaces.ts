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
  artists?: IArtist[];
  musics?: IMusic[];
}

export interface IMusic {
  id: number;
  title: string;
  bpm: number;
  length: string;
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
  musics?: IMusic[];
  albums?: IAlbum[];
  bands?: IBand[];
}

export interface IAlbum {
  id: number;
  title: string;
  ["release_date"]: string;
}

export interface IRole {
  id: number;
  role: string;
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
  // eslint-disable-next-line camelcase
  password_confirmation: string;
}

export interface IUserSuccessResponse {
  data: IUser;
}
