import { GraphQLClient } from "graphql-request";
import {
  IAlbum,
  IAlbumsType,
  IAlbumType,
  IArtist,
  IArtistsType,
  IArtistType,
  IBand,
  IBandsType,
  IBandType,
  IIndexType,
  IIssue,
  IIssuesType,
  IIssueType,
  IMusic,
  IMusicsType,
  IMusicType,
  INotification,
  IUser,
  IUsersType,
  IUserType,
} from "../interfaces";
import albumQuery from "./query/album";
import albumMusicsQuery from "./query/album/musics";
import albumsQuery from "./query/albums";
import artistQuery from "./query/artist";
import artistAlbumsQuery from "./query/artist/album";
import artistMusicsQuery from "./query/artist/musics";
import artistsQuery from "./query/artists";
import bandQuery from "./query/band";
import bandAlbumsQuery from "./query/band/albums";
import bandMusicsQuery from "./query/band/musics";
import issueQuery from "./query/issue";
import bandsQuery from "./query/bands";
import issuesQuery from "./query/issues";
import musicQuery from "./query/music";
import rootTreeQuery from "./query/music/rootTree";
import musicScoreQuery from "./query/music/score";
import musicsQuery from "./query/musics";
import userQuery from "./query/user";
import userBookmarkedAlbumsQuery from "./query/user/bookmarkedAlbums";
import userBookmarkedArtistsQuery from "./query/user/bookmarkedArtists";
import userBookmarkedBandsQuery from "./query/user/bookmarkedBands";
import userBookmarkedMusicsQuery from "./query/user/bookmarkedMusics";
import userFollowerQuery from "./query/user/followers";
import userFollowingQuery from "./query/user/following";
import userMusicsQuery from "./query/user/musics";
import userProfileQuery from "./query/user/profile";
import usersQuery from "./query/users";
import blobQuery from "./query/music/blob";
import treeQuery from "./query/music/tree";
import baseURL from "../constants/baseURL";
import userNotificationsQuery from "./query/user/notifications";

const graphQLCilent = new GraphQLClient(`${baseURL}/graphql`);

export const getUsers =
  (page: number, q?: { [key: string]: string }) =>
  (): Promise<IIndexType<IUser>> =>
    graphQLCilent
      .request<IUsersType>(usersQuery, { page, q })
      .then((res) => res.users);
export const getUser =
  (id: number, currentUserId: undefined | number) => (): Promise<IUser> =>
    graphQLCilent
      .request<IUserType>(userQuery, { id, currentUserId })
      .then((res) => res.user);
export const getUserProfile = (id: number) => (): Promise<IUser> =>
  graphQLCilent
    .request<IUserType>(userProfileQuery, { id })
    .then((res) => res.user);
export const getUserMusics =
  (id: number, page: number) => (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IUserType>(userMusicsQuery, { id, musicPage: page })
      .then((res) => res.user.musics);
export const getUserNotifications =
  (id: number | undefined, page: number) =>
  (): Promise<IIndexType<INotification> & { notificationExist: boolean }> =>
    graphQLCilent
      .request<IUserType>(userNotificationsQuery, {
        id,
        notificationPage: page,
      })
      .then((res) => res.user.notifications);
export const getUserBookmarkedMusics =
  (id: number, page: number) => (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedMusicsQuery, {
        id,
        bookmarkedMusicPage: page,
      })
      .then((res) => res.user.bookmarkedMusics);
export const getUserBookmarkedArtists =
  (id: number, page: number) => (): Promise<IIndexType<IArtist>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedArtistsQuery, {
        id,
        bookmarkedArtistPage: page,
      })
      .then((res) => res.user.bookmarkedArtists);
export const getUserBookmarkedBands =
  (id: number, page: number) => (): Promise<IIndexType<IBand>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedBandsQuery, {
        id,
        bookmarkedBandPage: page,
      })
      .then((res) => res.user.bookmarkedBands);
export const getUserBookmarkedAlbums =
  (id: number, page: number) => (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedAlbumsQuery, {
        id,
        bookmarkedAlbumPage: page,
      })
      .then((res) => res.user.bookmarkedAlbums);
export const getUserFollower =
  (id: number, page: number) => (): Promise<IIndexType<IUser>> =>
    graphQLCilent
      .request<IUserType>(userFollowerQuery, {
        id,
        followerPage: page,
      })
      .then((res) => res.user.followers);
export const getUserFollowing =
  (id: number, page: number) => (): Promise<IIndexType<IUser>> =>
    graphQLCilent
      .request<IUserType>(userFollowingQuery, {
        id,
        followingPage: page,
      })
      .then((res) => res.user.following);
export const getMusics =
  (page: number, q?: { s?: string; [key: string]: string | undefined }) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IMusicsType>(musicsQuery, {
        page,
        q,
      })
      .then((res) => res.musics);
export const getMusic =
  (id: number, currentUserId: number | undefined) => (): Promise<IMusic> =>
    graphQLCilent
      .request<IMusicType>(musicQuery, {
        id,
        currentUserId,
      })
      .then((res) => res.music);
export const getMusicScore = (id: number) => (): Promise<IMusic> =>
  graphQLCilent
    .request<IMusicType>(musicScoreQuery, {
      id,
    })
    .then((res) => res.music);
export const getMusicRootTree = (id: number) => (): Promise<IMusic> =>
  graphQLCilent
    .request<IMusicType>(rootTreeQuery, {
      id,
    })
    .then((res) => res.music);
export const getMusicTree = (id: number, oid: string) => (): Promise<IMusic> =>
  graphQLCilent
    .request<IMusicType>(treeQuery, {
      id,
      oid,
    })
    .then((res) => res.music);
export const getMusicBlob = (id: number, oid: string) => (): Promise<IMusic> =>
  graphQLCilent
    .request<IMusicType>(blobQuery, {
      id,
      oid,
    })
    .then((res) => res.music);
export const getIssues =
  (musicId: number, page: number, q?: { [key: string]: string }) =>
  (): Promise<IIndexType<IIssue>> =>
    graphQLCilent
      .request<IIssuesType>(issuesQuery, {
        musicId,
        page,
        q,
      })
      .then((res) => res.issues);
export const getIssue = (id: number) => (): Promise<IIssue> =>
  graphQLCilent
    .request<IIssueType>(issueQuery, {
      id,
    })
    .then((res) => res.issue);
export const getBands =
  (page: number, q?: { [key: string]: string }) =>
  (): Promise<IIndexType<IBand>> =>
    graphQLCilent
      .request<IBandsType>(bandsQuery, {
        page,
        q,
      })
      .then((res) => res.bands);
export const getBand =
  (id: number, currentUserId: number | undefined) => (): Promise<IBand> =>
    graphQLCilent
      .request<IBandType>(bandQuery, {
        id,
        currentUserId,
      })
      .then((res) => res.band);
export const getBandAlbums =
  (id: number, page: number) => (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IBandType>(bandAlbumsQuery, {
        id,
        albumPage: page,
      })
      .then((res) => res.band.albums);
export const getBandMusics =
  (id: number, page: number) => (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IBandType>(bandMusicsQuery, {
        id,
        musicPage: page,
      })
      .then((res) => res.band.musics);
export const getArtists =
  (page: number, q?: { [key: string]: string }) =>
  (): Promise<IIndexType<IArtist>> =>
    graphQLCilent
      .request<IArtistsType>(artistsQuery, {
        page,
        q,
      })
      .then((res) => res.artists);
export const getArtist =
  (id: number, currentUserId: number | undefined) => (): Promise<IArtist> =>
    graphQLCilent
      .request<IArtistType>(artistQuery, {
        id,
        currentUserId,
      })
      .then((res) => res.artist);
export const getArtistAlbums =
  (id: number, page: number) => (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IArtistType>(artistAlbumsQuery, {
        id,
        albumPage: page,
      })
      .then((res) => res.artist.albums);
export const getArtistMusics =
  (id: number, page: number) => (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IArtistType>(artistMusicsQuery, {
        id,
        musicPage: page,
      })
      .then((res) => res.artist.musics);
export const getAlbums =
  (page: number, q?: { [key: string]: string }) =>
  (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IAlbumsType>(albumsQuery, {
        page,
        q,
      })
      .then((res) => res.albums);
export const getAlbum =
  (id: number, currentUserId: number | undefined) => (): Promise<IAlbum> =>
    graphQLCilent
      .request<IAlbumType>(albumQuery, {
        id,
        currentUserId,
      })
      .then((res) => res.album);
export const getAlbumMusics =
  (id: number, page: number) => (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IAlbumType>(albumMusicsQuery, {
        id,
        musicPage: page,
      })
      .then((res) => res.album.musics);
