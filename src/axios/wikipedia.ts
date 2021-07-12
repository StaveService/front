import axios from "axios-jsonp-pro";
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
  srsearch: string,
  sroffset: number
): Promise<IWikipediaResponse<IWikipediaSearch>> =>
  wikipedia.jsonp<null, IWikipediaResponse<IWikipediaSearch>>("", {
    params: {
      format: "json",
      action: "query",
      list: "search",
      srsearch,
      sroffset,
    },
  });
export const getWikipedia = (
  pageid: number | undefined | null
): Promise<IWikipedia> =>
  wikipedia
    .jsonp<null, IWikipediaResponse<IWikipediaGet>>("", {
      params: {
        format: "json",
        action: "query",
        prop: "extracts",
        explaintext: true,
        exintro: true,
        pageids: pageid,
      },
    })
    .then((res) => res.query.pages[pageid || 0]);
