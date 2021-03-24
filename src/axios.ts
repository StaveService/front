import axios from "axios";

const itunesSearch = axios.create({
  baseURL: "https://itunes.apple.com",
});

export default itunesSearch;
