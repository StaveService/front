import axios from "axios";
import {
  IWikipedia,
  IWikipediaGet,
  IWikipediaResponse,
  IWikipediaSearch,
} from "../interfaces";

const wikipedia = axios.create({
  baseURL: "https://ja.wikipedia.org/w/api.php",
});

export const searchWikipedia = (
  srsearch: string
): Promise<IWikipediaResponse<IWikipediaSearch>> =>
  wikipedia
    .get<IWikipediaResponse<IWikipediaSearch>>("", {
      params: {
        format: "json",
        action: "query",
        list: "search",
        srsearch,
      },
    })
    .then((res) => res.data);
export const getWikipedia = (pageid: number | undefined): Promise<IWikipedia> =>
  wikipedia
    .get<IWikipediaResponse<IWikipediaGet>>("", {
      params: {
        format: "json",
        action: "query",
        prop: "extracts",
        explaintext: true,
        exintro: true,
        pageids: pageid,
      },
    })
    .then((res) => res.data.query.pages[pageid || 0]);
