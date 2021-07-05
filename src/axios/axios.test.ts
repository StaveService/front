import {
  postMusic,
  deleteMusic,
  signIn,
  postBand,
  postAlbum,
  signUp,
  deleteUser,
  deleteBand,
  deleteAlbum,
  deleteArtist,
  postArtist,
  patchMusicLink,
  postMusicBookmark,
  deleteMusicBookmark,
  postBandBookmark,
  deleteArtistBookmark,
  postArtistBookmark,
  patchAlbumLink,
  deleteBandBookmark,
  patchArtistLink,
  patchBandLink,
} from "./axios";
import {
  IAlbum,
  IArtist,
  IArtistBookmark,
  IBand,
  IBandBookmark,
  IHeaders,
  IMusic,
  IMusicBookmark,
  ITokenHeaders,
  IUser,
} from "../interfaces";
import testUser from "../constants/user.json";
import routes from "../constants/routes.json";

let headers: IHeaders;
let user: IUser;

// helpers
const signUpTest = async () => {
  const res = await signUp({
    nickname: testUser.NICKNAME,
    familyname: testUser.FAMILYNAME,
    givenname: testUser.GIVENNAME,
    email: testUser.EMAIL,
    password: testUser.PASSWORD,
    password_confirmation: testUser.PASSWORD,
  });
  headers = { headers: res.headers };
  user = res.data.data;
  return res;
};
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
describe("/sign", () => {
  it("up", async () => {
    const res = await signUpTest();
    expect(res.status).toBe(200);
  });
  it("in", async () => {
    const res = await signInTest();
    expect(res.status).toBe(200);
  });
});

describe(routes.MUSICS, () => {
  let music: IMusic;
  it("POST", async () => {
    const res = await postMusic(
      user.id,
      {
        title: "testMusic",
        tab: "",
        link_attributes: {
          itunes: 0,
          musixmatch: 0,
          spotify: "spotify",
        },
      },
      headers
    );
    music = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  describe(routes.BOOKMARKS, () => {
    let bookmark: IMusicBookmark;
    it("POST", async () => {
      const res = await postMusicBookmark(user.id, music.id, headers);
      bookmark = res.data;
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("DELETE", async () => {
      const res = await deleteMusicBookmark(
        user.id,
        music.id,
        bookmark.id,
        headers
      );
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });
  describe(routes.LINKS, () => {
    it("PATCH", async () => {
      const res = await patchMusicLink(
        user.id,
        music.id,
        music.link.id,
        { itunes: 0 },
        headers
      );
      setHeaders(res.headers);
      expect(res.status).toBe(200);
    });
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
    const res = await postAlbum(
      {
        title: "testAlbum",
        link_attributes: { itunes: 0, spotify: "spotify" },
      },
      headers
    );
    album = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  describe(routes.LINKS, () => {
    it("PATCH", async () => {
      const res = await patchAlbumLink(
        album.id,
        album.link.id,
        { itunes: 0 },
        headers
      );
      setHeaders(res.headers);
      expect(res.status).toBe(200);
    });
  });
  it("DELETE", async () => {
    const res = await deleteAlbum(album.id, headers);
    setHeaders(res.headers);
    expect(res.status).toBe(204);
  });
});

describe(routes.BANDS, () => {
  let band: IBand;
  it("POST", async () => {
    const res = await postBand(
      {
        name: "testBand",
        link_attributes: {
          itunes: 0,
          spotify: "spotify",
          wikipedia: 0,
          twitter: "string",
        },
      },
      headers
    );
    band = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  describe(routes.BOOKMARKS, () => {
    let bookmark: IBandBookmark;
    it("POST", async () => {
      const res = await postBandBookmark(band.id, headers);
      bookmark = res.data;
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("DELETE", async () => {
      const res = await deleteBandBookmark(band.id, bookmark.id, headers);
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });
  describe(routes.LINKS, () => {
    it("PATCH", async () => {
      const res = await patchBandLink(
        band.id,
        band.link.id,
        { itunes: 0 },
        headers
      );
      setHeaders(res.headers);
      expect(res.status).toBe(200);
    });
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
    const res = await postArtist(
      {
        name: "testArtist",
        link_attributes: {
          itunes: 0,
          spotify: "spotify",
          wikipedia: 0,
          twitter: "string",
        },
      },
      headers
    );
    artist = res.data;
    setHeaders(res.headers);
    expect(res.status).toBe(201);
  });
  describe(routes.BOOKMARKS, () => {
    let bookmark: IArtistBookmark;
    it("POST", async () => {
      const res = await postArtistBookmark(artist.id, headers);
      bookmark = res.data;
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("DELETE", async () => {
      const res = await deleteArtistBookmark(artist.id, bookmark.id, headers);
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });
  describe(routes.LINKS, () => {
    it("PATCH", async () => {
      const res = await patchArtistLink(
        artist.id,
        artist.link.id,
        { itunes: 0 },
        headers
      );
      setHeaders(res.headers);
      expect(res.status).toBe(200);
    });
  });
  it("DELETE", async () => {
    const res = await deleteArtist(artist.id, headers);
    setHeaders(res.headers);
    expect(res.status).toBe(204);
  });
});

describe("/user", () => {
  it("DELETE", async () => {
    const res = await deleteUser(user.id);
    expect(res.status).toBe(204);
  });
});
