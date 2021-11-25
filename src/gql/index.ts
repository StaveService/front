import { GraphQLClient } from "graphql-request";
import { UseQueryOptions } from "react-query";
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
import { ILocale } from "../slices/language";

export type IndexQueryFnArgs<T> = {
  page: number;
  locale?: ILocale;
  q?: { s?: string; [key: string]: string | undefined };
  options?: UseQueryOptions<T>;
};
export type ResourcesIndexQueryFnArgs<T> = {
  id: number | undefined;
  page: number;
  locale?: ILocale;
  q?: { s?: string; [key: string]: string | undefined };
  options?: UseQueryOptions<T>;
};

export type ShowQueryFnArgs<T> = {
  id: number;
  locale?: ILocale;
  currentUserId?: number | undefined;
  oid?: string;
  options?: UseQueryOptions<T>;
};
const graphQLCilent = new GraphQLClient(`${baseURL}/graphql`);
export const getUsers =
  ({ page, q }: IndexQueryFnArgs<IIndexType<IUser>>) =>
  (): Promise<IIndexType<IUser>> =>
    graphQLCilent
      .request<IUsersType>(usersQuery, { page, q })
      .then((res) => res.users);
export const getUser =
  ({ id, currentUserId }: ShowQueryFnArgs<IUser>) =>
  (): Promise<IUser> =>
    graphQLCilent
      .request<IUserType>(userQuery, { id, currentUserId })
      .then((res) => res.user);
export const getUserProfile = (id: number) => (): Promise<IUser> =>
  graphQLCilent
    .request<IUserType>(userProfileQuery, { id })
    .then((res) => res.user);
export const getUserMusics =
  ({
    id,
    page: musicPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<IMusic>>) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IUserType>(userMusicsQuery, {
        id,
        musicPage,
        locale,
      })
      .then((res) => res.user.musics);
export const getUserNotifications =
  ({
    id,
    page: notificationPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<INotification>>) =>
  (): Promise<IIndexType<INotification>> =>
    graphQLCilent
      .request<IUserType>(userNotificationsQuery, {
        id,
        notificationPage,
        locale,
      })
      .then((res) => res.user.notifications);
export const getUserBookmarkedMusics =
  ({ id, page, locale }: ResourcesIndexQueryFnArgs<IMusic>) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedMusicsQuery, {
        id,
        bookmarkedMusicPage: page,
        locale,
      })
      .then((res) => res.user.bookmarkedMusics);
export const getUserBookmarkedArtists =
  ({ id, page, locale }: ResourcesIndexQueryFnArgs<IIndexType<IArtist>>) =>
  (): Promise<IIndexType<IArtist>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedArtistsQuery, {
        id,
        bookmarkedArtistPage: page,
        locale,
      })
      .then((res) => res.user.bookmarkedArtists);
export const getUserBookmarkedBands =
  ({ id, page, locale }: ResourcesIndexQueryFnArgs<IIndexType<IBand>>) =>
  (): Promise<IIndexType<IBand>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedBandsQuery, {
        id,
        bookmarkedBandPage: page,
        locale,
      })
      .then((res) => res.user.bookmarkedBands);
export const getUserBookmarkedAlbums =
  ({ id, page, locale }: ResourcesIndexQueryFnArgs<IIndexType<IAlbum>>) =>
  (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IUserType>(userBookmarkedAlbumsQuery, {
        id,
        bookmarkedAlbumPage: page,
        locale,
      })
      .then((res) => res.user.bookmarkedAlbums);
export const getUserFollower =
  ({ id, page: followerPage }: ResourcesIndexQueryFnArgs<IIndexType<IUser>>) =>
  (): Promise<IIndexType<IUser>> =>
    graphQLCilent
      .request<IUserType>(userFollowerQuery, {
        id,
        followerPage,
      })
      .then((res) => res.user.followers);
export const getUserFollowing =
  ({ id, page: followingPage }: ResourcesIndexQueryFnArgs<IIndexType<IUser>>) =>
  (): Promise<IIndexType<IUser>> =>
    graphQLCilent
      .request<IUserType>(userFollowingQuery, {
        id,
        followingPage,
      })
      .then((res) => res.user.following);
export const getMusics =
  ({ page, locale, q }: IndexQueryFnArgs<IIndexType<IMusic>>) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IMusicsType>(musicsQuery, {
        page,
        locale,
        q,
      })
      .then((res) => res.musics);
export const getMusic =
  ({ id, locale, currentUserId }: ShowQueryFnArgs<IMusic>) =>
  (): Promise<IMusic> =>
    graphQLCilent
      .request<IMusicType>(musicQuery, {
        id,
        locale,
        currentUserId,
      })
      .then((res) => res.music);
export const getMusicScore =
  ({ id, locale }: ShowQueryFnArgs<IMusic>) =>
  (): Promise<IMusic> =>
    graphQLCilent
      .request<IMusicType>(musicScoreQuery, {
        id,
        locale,
      })
      .then((res) => res.music);
export const getMusicRootTree =
  ({ id }: ShowQueryFnArgs<IMusic>) =>
  (): Promise<IMusic> =>
    graphQLCilent
      .request<IMusicType>(rootTreeQuery, {
        id,
      })
      .then((res) => res.music);
export const getMusicTree =
  ({ id, oid }: ShowQueryFnArgs<IMusic>) =>
  (): Promise<IMusic> =>
    graphQLCilent
      .request<IMusicType>(treeQuery, {
        id,
        oid,
      })
      .then((res) => res.music);
export const getMusicBlob =
  ({ id, oid }: ShowQueryFnArgs<IMusic>) =>
  (): Promise<IMusic> =>
    graphQLCilent
      .request<IMusicType>(blobQuery, {
        id,
        oid,
      })
      .then((res) => res.music);
export const getIssues =
  ({ id: musicId, page, q }: ResourcesIndexQueryFnArgs<IIndexType<IIssue>>) =>
  (): Promise<IIndexType<IIssue>> =>
    graphQLCilent
      .request<IIssuesType>(issuesQuery, {
        musicId,
        page,
        q,
      })
      .then((res) => res.issues);
export const getIssue =
  ({ id }: ShowQueryFnArgs<IIssue>) =>
  (): Promise<IIssue> =>
    graphQLCilent
      .request<IIssueType>(issueQuery, {
        id,
      })
      .then((res) => res.issue);
export const getBands =
  ({ page, locale, q }: IndexQueryFnArgs<IIndexType<IBand>>) =>
  (): Promise<IIndexType<IBand>> =>
    graphQLCilent
      .request<IBandsType>(bandsQuery, {
        page,
        locale,
        q,
      })
      .then((res) => res.bands);
export const getBand =
  ({ id, locale, currentUserId }: ShowQueryFnArgs<IBand>) =>
  (): Promise<IBand> =>
    graphQLCilent
      .request<IBandType>(bandQuery, {
        id,
        locale,
        currentUserId,
      })
      .then((res) => res.band);
export const getBandAlbums =
  ({
    id,
    page: albumPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<IAlbum>>) =>
  (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IBandType>(bandAlbumsQuery, {
        id,
        albumPage,
        locale,
      })
      .then((res) => res.band.albums);
export const getBandMusics =
  ({
    id,
    page: musicPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<IMusic>>) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IBandType>(bandMusicsQuery, {
        id,
        musicPage,
        locale,
      })
      .then((res) => res.band.musics);
export const getArtists =
  ({ page, locale, q }: IndexQueryFnArgs<IIndexType<IArtist>>) =>
  (): Promise<IIndexType<IArtist>> =>
    graphQLCilent
      .request<IArtistsType>(artistsQuery, {
        page,
        locale,
        q,
      })
      .then((res) => res.artists);
export const getArtist =
  ({ id, locale, currentUserId }: ShowQueryFnArgs<IArtist>) =>
  (): Promise<IArtist> =>
    graphQLCilent
      .request<IArtistType>(artistQuery, {
        id,
        locale,
        currentUserId,
      })
      .then((res) => res.artist);
export const getArtistAlbums =
  ({
    id,
    page: albumPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<IAlbum>>) =>
  (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IArtistType>(artistAlbumsQuery, {
        id,
        albumPage,
        locale,
      })
      .then((res) => res.artist.albums);
export const getArtistMusics =
  ({
    id,
    page: musicPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<IMusic>>) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IArtistType>(artistMusicsQuery, {
        id,
        musicPage,
        locale,
      })
      .then((res) => res.artist.musics);
export const getAlbums =
  ({ page, locale, q }: IndexQueryFnArgs<IIndexType<IAlbum>>) =>
  (): Promise<IIndexType<IAlbum>> =>
    graphQLCilent
      .request<IAlbumsType>(albumsQuery, {
        page,
        locale,
        q,
      })
      .then((res) => res.albums);
export const getAlbum =
  ({ id, locale, currentUserId }: ShowQueryFnArgs<IAlbum>) =>
  (): Promise<IAlbum> =>
    graphQLCilent
      .request<IAlbumType>(albumQuery, {
        id,
        locale,
        currentUserId,
      })
      .then((res) => res.album);
export const getAlbumMusics =
  ({
    id,
    page: musicPage,
    locale,
  }: ResourcesIndexQueryFnArgs<IIndexType<IMusic>>) =>
  (): Promise<IIndexType<IMusic>> =>
    graphQLCilent
      .request<IAlbumType>(albumMusicsQuery, {
        id,
        musicPage,
        locale,
      })
      .then((res) => res.album.musics);
