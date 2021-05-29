import axios from "axios";

export const itunes = axios.create({
  baseURL: "https://itunes.apple.com",
});
export const wiki = axios.create({
  baseURL: "http://ja.wikipedia.org/w/api.php?",
  params: {
    format: "json",
  },
});
