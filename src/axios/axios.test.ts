import {
  postMusic,
  deleteMusic,
  signIn,
  postBand,
  deleteBand,
  postAlbum,
  postMusicBookmark,
} from "./axios";
import testUser from "../constants/user.json";
import routes from "../constants/routes.json";
import {
  IAlbum,
  IArtist,
  IBand,
  IHeaders,
  IMusic,
  ITokenHeaders,
  IUser,
} from "../interfaces";

let headers: IHeaders;
let user: IUser;

// helpers
const signInTest = async () => {
  const res = await signIn({
    email: testUser.EMAIL,
    password: testUser.PASSWORD,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  headers = { headers: res.headers };
  user = res.data.data;
  return res;
};

const setHeaders = (newHeaders: ITokenHeaders) => {
  const {
    "content-type": contentType,
    "access-token": accessToken,
    client,
    uid,
  } = newHeaders;
  headers = {
    headers: {
      "content-type": contentType,
      "access-token": accessToken || headers.headers["access-token"],
      client,
      uid,
    },
  };
};
describe("/signin", () => {
  it("", async () => {
    const res = await signInTest();
    expect(res.status).toBe(200);
  });
});

describe(routes.MUSICS, () => {
  let music: IMusic;
  it("POST", async () => {
    const res = await postMusic(
      user.id,
      { title: "testMusic", tab: "" },
      headers
    );
    music = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  it("DELETE", async () => {
    const res = await deleteMusic(user.id, music.id, headers);
    setHeaders(res.headers);
    expect(res.status).toBe(204);
  });
});
describe(routes.ALBUMS, () => {
  let album: IAlbum;
  it("POST", async () => {
    const res = await postAlbum({ title: "testAlbum" }, headers);
    album = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  it("DELETE", async () => {
    const res = await deleteMusic(user.id, album.id, headers);
    setHeaders(res.headers);
    expect(res.status).toBe(204);
  });
});

describe(routes.BANDS, () => {
  let band: IBand;
  it("POST", async () => {
    const res = await postBand({ name: "testBand" }, headers);
    band = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  it("DELETE", async () => {
    const res = await deleteBand(band.id, headers);
    setHeaders(res.headers);
    expect(res.status).toBe(204);
  });
});
describe(routes.ARTISTS, () => {
  let artist: IArtist;
  it("POST", async () => {
    const res = await postBand({ name: "testArtist" }, headers);
    artist = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  it("DELETE", async () => {
    const res = await deleteBand(artist.id, headers);
    setHeaders(res.headers);
    expect(res.status).toBe(204);
  });
});
