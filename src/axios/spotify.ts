import axios from "axios";

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});
export const spotifyToken = axios.create({
  baseURL: "https://accounts.spotify.com/api/token",
  params: {
    client_id: process.env.REACT_APP_SPOTIFY_KEY,
    grant_type: "authorization_code",
    redirect_uri: window.location.origin,
  },
});

export default undefined;
