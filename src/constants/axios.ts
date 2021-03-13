import axios from 'axios';

const itunesAxios = axios.create({ baseURL: 'https://itunes.apple.com' });

export { itunesAxios };
