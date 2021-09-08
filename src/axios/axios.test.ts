import {
  postMusic,
  deleteMusic,
  postBand,
  postAlbum,
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
  postIssue,
  patchMusic,
  patchAlbum,
  patchBand,
  patchArtist,
  patchUser,
  postUserRelationship,
  deleteUserRelationship,
  postContact,
  patchUserLink,
} from "./axios";
import {
  IAlbum,
  IArtist,
  IArtistBookmark,
  IBand,
  IBandBookmark,
  IMusic,
  IMusicBookmark,
} from "../interfaces";
import testUser from "../constants/user.json";
import routes from "../constants/routes.json";
import { signUp } from "../ui/Form/SignUp";
import { signIn } from "../ui/Form/SignIn";
import { setCurrentUser, setHeaders } from "../slices/currentUser/currentUser";
import { store } from "../store";

const getCurrentUser = () => store.getState().currentUser.currentUser;

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
  store.dispatch(setHeaders(res.headers));
  store.dispatch(setCurrentUser(res.data.data));
  return res;
};
const signInTest = async () => {
  const res = await signIn({
    email: testUser.EMAIL,
    password: testUser.PASSWORD,
  });
  store.dispatch(setHeaders(res.headers));
  store.dispatch(setCurrentUser(res.data.data));
  return res;
};

afterAll(async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  try {
    await deleteUser(currentUser.id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
});
describe("axios", () => {
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
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    it("POST", async () => {
      const res = await postMusic(getCurrentUser()?.id, {
        title: "testMusic",
        link_attributes: {
          itunes: 0,
          musixmatch: 0,
          spotify: "spotify",
          youtube: "",
        },
      });
      music = res.data;
      store.dispatch(setHeaders(res.headers));
      expect(res.status).toBe(201);
    });
    it("PATCH", async () => {
      const res = await patchMusic(getCurrentUser()?.id)(music.id, {
        title: "testMusic",
      });
      store.dispatch(setHeaders(res.headers));
      expect(res.status).toBe(200);
    });
    describe(routes.BOOKMARKS, () => {
      let bookmark: IMusicBookmark;
      it("POST", async () => {
        const res = await postMusicBookmark(currentUser.id, music.id);
        bookmark = res.data;
        setHeaders(res.headers);
        expect(res.status).toBe(201);
      });
      it("DELETE", async () => {
        const res = await deleteMusicBookmark(
          currentUser.id,
          music.id,
          bookmark.id
        );
        setHeaders(res.headers);
        expect(res.status).toBe(204);
      });
    });
    describe(routes.ISSUES, () => {
      it("POST", async () => {
        const res = await postIssue(currentUser.id, music.id, {
          title: "title",
          description: "description",
        });
        setHeaders(res.headers);
        expect(res.status).toBe(201);
      });
    });
    describe(routes.LINKS, () => {
      it("PATCH", async () => {
        const res = await patchMusicLink(
          currentUser.id,
          music.id,
          music.link.id,
          { itunes: 0 }
        );
        setHeaders(res.headers);
        expect(res.status).toBe(200);
      });
    });
    it("DELETE", async () => {
      const res = await deleteMusic(currentUser.id, music.id);
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });
  describe(routes.ALBUMS, () => {
    let album: IAlbum;
    it("POST", async () => {
      const res = await postAlbum({
        title: "testAlbum",
        link_attributes: { itunes: 0, spotify: "spotify" },
      });
      album = res.data;
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("PATCH", async () => {
      const res = await patchAlbum(album.id, {
        title: "testAlbum",
      });
      store.dispatch(setHeaders(res.headers));
      expect(res.status).toBe(200);
    });
    describe(routes.LINKS, () => {
      it("PATCH", async () => {
        const res = await patchAlbumLink(album.id, album.link.id, {
          itunes: 0,
        });
        setHeaders(res.headers);
        expect(res.status).toBe(200);
      });
    });
    it("DELETE", async () => {
      const res = await deleteAlbum(album.id);
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });

  describe(routes.BANDS, () => {
    let band: IBand;
    it("POST", async () => {
      const res = await postBand({
        name: "testBand",
        link_attributes: {
          itunes: 0,
          spotify: "spotify",
          wikipedia: 0,
          twitter: "string",
        },
      });
      band = res.data;
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("PATCH", async () => {
      const res = await patchBand(band.id, {
        name: "testBand",
      });
      store.dispatch(setHeaders(res.headers));
      expect(res.status).toBe(200);
    });
    describe(routes.BOOKMARKS, () => {
      let bookmark: IBandBookmark;
      it("POST", async () => {
        const res = await postBandBookmark(band.id);
        bookmark = res.data;
        setHeaders(res.headers);
        expect(res.status).toBe(201);
      });
      it("DELETE", async () => {
        const res = await deleteBandBookmark(band.id, bookmark.id);
        setHeaders(res.headers);
        expect(res.status).toBe(204);
      });
    });
    describe(routes.LINKS, () => {
      it("PATCH", async () => {
        const res = await patchBandLink(band.id, band.link.id, { itunes: 0 });
        setHeaders(res.headers);
        expect(res.status).toBe(200);
      });
    });
    it("DELETE", async () => {
      const res = await deleteBand(band.id);
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });
  describe(routes.ARTISTS, () => {
    let artist: IArtist;
    it("POST", async () => {
      const res = await postArtist({
        name: "testArtist",
        link_attributes: {
          itunes: 0,
          spotify: "spotify",
          wikipedia: 0,
          twitter: "string",
        },
      });
      artist = res.data;
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("PATCH", async () => {
      const res = await patchArtist(artist.id, {
        name: "testArtist",
      });
      store.dispatch(setHeaders(res.headers));
      expect(res.status).toBe(200);
    });
    describe(routes.BOOKMARKS, () => {
      let bookmark: IArtistBookmark;
      it("POST", async () => {
        const res = await postArtistBookmark(artist.id);
        bookmark = res.data;
        setHeaders(res.headers);
        expect(res.status).toBe(201);
      });
      it("DELETE", async () => {
        const res = await deleteArtistBookmark(artist.id, bookmark.id);
        setHeaders(res.headers);
        expect(res.status).toBe(204);
      });
    });
    describe(routes.LINKS, () => {
      it("PATCH", async () => {
        const res = await patchArtistLink(artist.id, artist.link.id, {
          itunes: 0,
        });
        setHeaders(res.headers);
        expect(res.status).toBe(200);
      });
    });
    it("DELETE", async () => {
      const res = await deleteArtist(artist.id);
      setHeaders(res.headers);
      expect(res.status).toBe(204);
    });
  });

  describe("/relation", () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    it("POST", async () => {
      const res = await postUserRelationship(1);
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
    it("DELETE", async () => {
      const res = await deleteUserRelationship(1, currentUser.id);
      setHeaders(res.headers);
      expect(res.status).toBe(201);
    });
  });

  describe("/contact", () => {
    it("POST", async () => {
      const res = await postContact({
        email: "i@i.com",
        description: "front testing",
      });
      expect(res.status).toBe(200);
    });
  });

  describe("/user", () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    it("PATCH", async () => {
      const res = await patchUser(currentUser.id, {
        email: "a@a.com",
        introduction: "aaaaaaaaaa",
        nickname: "test",
        familyname: "test",
        givenname: "test",
      });
      expect(res.status).toBe(200);
    });
    describe("/link", () => {
      it("PATCH", async () => {
        const res = await patchUserLink(
          currentUser.id,
          currentUser.link.id,
          "aaaaaa"
        );
        expect(res.status).toBe(200);
      });
    });
    it("DELETE", async () => {
      const res = await deleteUser(currentUser.id);
      expect(res.status).toBe(204);
    });
  });
});
