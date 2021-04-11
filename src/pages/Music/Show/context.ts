import { createContext, Dispatch, SetStateAction } from "react";
import { IItunesMusic, IMusic } from "../../../interfaces";

interface IMusicState {
  loading: boolean;
  music?: IMusic;
  setMusic: Dispatch<SetStateAction<IMusic | undefined>>;
  itunesMusic?: IItunesMusic;
  setItunesMusic: Dispatch<SetStateAction<IItunesMusic | undefined>>;
}

export default createContext({} as IMusicState);
