import { createContext, Dispatch, SetStateAction } from "react";
import { IMusic } from "../../../interfaces";

interface IMusicState {
  music?: IMusic;
  setMusic: Dispatch<SetStateAction<IMusic | undefined>>;
}

export default createContext({} as IMusicState);
