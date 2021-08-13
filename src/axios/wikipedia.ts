import axios from "axios-jsonp-pro";
import {
  IWikipedia,
  IWikipediaGet,
  IWikipediaResponse,
  IWikipediaSearch,
} from "../interfaces";
import { store } from "../store";

const getLocale = () => store.getState().language.locale;

export const searchWikipedia = (
  srsearch: string,
  sroffset: number
): Promise<IWikipediaResponse<IWikipediaSearch>> =>
  axios.jsonp<null, IWikipediaResponse<IWikipediaSearch>>(
    `https://${getLocale()}.wikipedia.org/w/api.php`,
    {
      params: {
        format: "json",
        action: "query",
        list: "search",
        srsearch,
        sroffset,
      },
    }
  );
export const getWikipedia = (
  pageid: number | undefined | null
): Promise<IWikipedia> =>
  axios
    .jsonp<null, IWikipediaResponse<IWikipediaGet>>(
      `https://${getLocale()}.wikipedia.org/w/api.php`,
      {
        params: {
          format: "json",
          action: "query",
          prop: "extracts",
          explaintext: true,
          exintro: true,
          pageids: pageid,
        },
      }
    )
    .then((res) => res.query.pages[pageid || 0]);
