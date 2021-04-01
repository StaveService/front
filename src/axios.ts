import axios from "axios";

const itunes = axios.create({
  baseURL: "https://itunes.apple.com",
});

export default itunes;
