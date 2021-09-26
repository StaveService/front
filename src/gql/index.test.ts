import {
  getAlbum,
  getAlbumMusics,
  getAlbums,
  getArtist,
  getArtistAlbums,
  getArtistMusics,
  getBand,
  getBandAlbums,
  getBandMusics,
  getBands,
  getMusic,
  getMusics,
  getUser,
  getUserBookmarkedAlbums,
  getUserBookmarkedArtists,
  getUserBookmarkedBands,
  getUserBookmarkedMusics,
  getUserFollower,
  getUserFollowing,
  getUserMusics,
  getUserNotifications,
  getUserProfile,
  getUsers,
} from ".";
import { IIndexType, IUser } from "../interfaces";

const expectIndexType = <T>() =>
  expect.objectContaining<IIndexType<T>>({
    pagination: { totalPages: expect.any(Number) as number },
    data: expect.any(Array) as T[],
  }) as IIndexType<T>;

describe("User", () => {
  it("Index", async () => {
    const users = await getUsers({ page: 1 })();
    expect(users).toEqual(expectIndexType<IUser>());
  });
  describe("Show", () => {
    it("User", async () => {
      const user = await getUser({ id: 1, currentUserId: 1 })();
      expect(user).toEqual(
        expect.objectContaining({
          nickname: expect.any(String) as string,
          introduction: expect.any(String) as string,
          followingCount: expect.any(Number) as number,
          followersCount: expect.any(Number) as number,
        })
      );
    });
    it("Musics", async () => {
      const musics = await getUserMusics({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(musics).toEqual(expectIndexType());
    });
    it("Notifications", async () => {
      const notifications = await getUserNotifications({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(notifications).toEqual(expectIndexType());
    });
    it("Profile", async () => {
      const profile = await getUserProfile(1)();
      expect(profile).toEqual(
        expect.objectContaining({
          link: {
            id: expect.any(String) as string,
            twitter: null,
          },
        })
      );
    });
    it("BookmarkedAlbums", async () => {
      const bookmarkedAlbumPage = await getUserBookmarkedAlbums({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(bookmarkedAlbumPage).toEqual(expectIndexType());
    });
    it("BookmarkedArtists", async () => {
      const bookmarkedArtistPage = await getUserBookmarkedArtists({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(bookmarkedArtistPage).toEqual(expectIndexType());
    });
    it("BookmarkedBands", async () => {
      const bookmarkedBandPage = await getUserBookmarkedBands({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(bookmarkedBandPage).toEqual(expectIndexType());
    });
    it("BookmarkedMusics", async () => {
      const bookmarkedMusicPage = await getUserBookmarkedMusics({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(bookmarkedMusicPage).toEqual(expectIndexType());
    });
    it("Followers", async () => {
      const followersPage = await getUserFollower({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(followersPage).toEqual(expectIndexType());
    });
    it("Following", async () => {
      const followingPage = await getUserFollowing({
        id: 1,
        page: 1,
        locale: "ja",
      })();
      expect(followingPage).toEqual(expectIndexType());
    });
  });
});

describe("Music", () => {
  it("Index", async () => {
    const musics = await getMusics({
      page: 1,
      locale: "ja",
    })();
    expect(musics).toEqual(expectIndexType());
  });
  describe("Show", () => {
    it("Music", async () => {
      const music = await getMusic({ id: 1, locale: "ja", currentUserId: 1 })();
      expect(music).toEqual(
        expect.objectContaining({
          albums: expect.any(Array) as [],
          artistMusics: expect.any(Array) as [],
          band: expect.any(Object) as Record<string, unknown>,
          bookmarksCount: expect.any(Number) as number,
          composers: expect.any(Array) as [],
          id: expect.any(String) as number,
          link: expect.any(Object) as Record<string, unknown>,
          localed: expect.any(Boolean) as boolean,
          lyrists: expect.any(Array) as [],
          scoreExist: expect.any(Boolean) as boolean,
          title: expect.any(String) as string,
          user: expect.any(Object) as Record<string, unknown>,
        })
      );
    });
  });
});
describe("Band", () => {
  it("Index", async () => {
    const bands = await getBands({
      page: 1,
      locale: "ja",
    })();
    expect(bands).toEqual(expectIndexType());
  });
  describe("Show", () => {
    it("Band", async () => {
      const band = await getBand({ id: 1, locale: "ja", currentUserId: 1 })();
      expect(band).toEqual(
        expect.objectContaining({
          artists: expect.any(Array) as [],
          bookmarksCount: expect.any(Number) as number,
          id: expect.any(String) as number,
          link: expect.any(Object) as Record<string, unknown>,
          localed: expect.any(Boolean) as boolean,
          name: expect.any(String) as string,
        })
      );
    });
    it("Albums", async () => {
      const albums = await getBandAlbums({ id: 1, page: 1, locale: "ja" })();
      expect(albums).toEqual(expectIndexType());
    });
    it("Musics", async () => {
      const musics = await getBandMusics({ id: 1, page: 1, locale: "ja" })();
      expect(musics).toEqual(expectIndexType());
    });
  });
});
describe("Artist", () => {
  it("Index", async () => {
    const bands = await getBands({
      page: 1,
      locale: "ja",
    })();
    expect(bands).toEqual(expectIndexType());
  });
  describe("Show", () => {
    it("Artist", async () => {
      const band = await getArtist({ id: 1, locale: "ja", currentUserId: 1 })();
      expect(band).toEqual(
        expect.objectContaining({
          bands: expect.any(Array) as [],
          bookmarksCount: expect.any(Number) as number,
          id: expect.any(String) as number,
          link: expect.any(Object) as Record<string, unknown>,
          localed: expect.any(Boolean) as boolean,
          name: expect.any(String) as string,
        })
      );
    });
    it("Album", async () => {
      const albums = await getArtistAlbums({ id: 1, page: 1, locale: "ja" })();
      expect(albums).toEqual(expectIndexType());
    });
    it("Musics", async () => {
      const musics = await getArtistMusics({ id: 1, page: 1, locale: "ja" })();
      expect(musics).toEqual(expectIndexType());
    });
  });
});

describe("Album", () => {
  it("Index", async () => {
    const bands = await getAlbums({
      page: 1,
      locale: "ja",
    })();
    expect(bands).toEqual(expectIndexType());
  });
  describe("Show", () => {
    it("Album", async () => {
      const band = await getAlbum({ id: 1, locale: "ja", currentUserId: 1 })();
      expect(band).toEqual(
        expect.objectContaining({
          artists: expect.any(Array) as [],
          bookmarksCount: expect.any(Number) as number,
          id: expect.any(String) as number,
          link: expect.any(Object) as Record<string, unknown>,
          localed: expect.any(Boolean) as boolean,
          title: expect.any(String) as string,
        })
      );
    });
    it("Musics", async () => {
      const albums = await getAlbumMusics({ id: 1, page: 1, locale: "ja" })();
      expect(albums).toEqual(expectIndexType());
    });
  });
});
