import axios from "axios";

const itunesAxios = axios.create({ baseURL: "https://itunes.apple.com" });

const a = "a";
export { itunesAxios, a };
