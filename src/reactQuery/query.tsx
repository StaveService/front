import { useQuery, UseQueryResult } from "react-query";
import {
  getAlbum,
  getAlbumMusics,
  getAlbums,
  getArtist,
  getArtistAlbums,
  getArtistMusics,
  getArtists,
  getBand,
  getBandAlbums,
  getBandMusics,
  getBands,
  getIssue,
  getIssues,
  getMusic,
  getMusicBlob,
  getMusicRootTree,
  getMusics,
  getMusicScore,
  getMusicTree,
  getUser,
  getUserFollower,
  getUserFollowing,
  getUserMusics,
  getUserNotifications,
  getUsers,
  IndexQueryFnArgs,
  ResourcesIndexQueryFnArgs,
  ShowQueryFnArgs,
} from "../gql";
import useQuerySnackbar from "../hooks/useQuerySnackbar";
import {
  IAlbum,
  IArtist,
  IBand,
  IIndexType,
  IIssue,
  IMusic,
  INotification,
  IUser,
} from "../interfaces";

function useIndexQuery<T>(
  query: {
    key: string;
    fn: (
      fnArgs: IndexQueryFnArgs<IIndexType<T>>
    ) => () => Promise<IIndexType<T>>;
  },
  args: IndexQueryFnArgs<IIndexType<T>>
): UseQueryResult<IIndexType<T>> {
  const { page, locale, q, options } = args;
  const { key, fn } = query;
  const { onError } = useQuerySnackbar();
  return useQuery([key, page, locale, q], fn(args), {
    ...options,
    onError,
  });
}

export const useUsersQuery = (
  args: IndexQueryFnArgs<IIndexType<IUser>>
): UseQueryResult<IIndexType<IUser>> =>
  useIndexQuery<IUser>({ key: "users", fn: getUsers }, args);

export const useMusicsQuery = (
  args: IndexQueryFnArgs<IIndexType<IMusic>>
): UseQueryResult<IIndexType<IMusic>> =>
  useIndexQuery({ key: "musics", fn: getMusics }, args);

export const useDescBookmarkMusicsQuery = (
  args: IndexQueryFnArgs<IIndexType<IMusic>>
): UseQueryResult<IIndexType<IMusic>> =>
  useIndexQuery({ key: "descBookmarkMusics", fn: getMusics }, args);

export const useAlbumsQuery = (
  args: IndexQueryFnArgs<IIndexType<IAlbum>>
): UseQueryResult<IIndexType<IAlbum>> =>
  useIndexQuery({ key: "albums", fn: getAlbums }, args);

export const useArtistsQuery = (
  args: IndexQueryFnArgs<IIndexType<IArtist>>
): UseQueryResult<IIndexType<IArtist>> =>
  useIndexQuery({ key: "artists", fn: getArtists }, args);

export const useBandsQuery = (
  args: IndexQueryFnArgs<IIndexType<IBand>>
): UseQueryResult<IIndexType<IBand>> =>
  useIndexQuery({ key: "bands", fn: getBands }, args);

function useResourcesIndexQuery<T>(
  query: {
    firstKey: string;
    secondKey: string;
    fn: (fnArgs: ResourcesIndexQueryFnArgs) => () => Promise<IIndexType<T>>;
  },
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<T>> {
  const { id, page, locale, q } = args;
  const { firstKey, secondKey, fn } = query;
  const { onError } = useQuerySnackbar();
  return useQuery([firstKey, id, secondKey, locale, page, q], fn(args), {
    onError,
  });
}

export const useMusicIssuesQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IIssue>> =>
  useResourcesIndexQuery(
    { firstKey: "music", secondKey: "issues", fn: getIssues },
    args
  );

export const useBandMusicsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IMusic>> =>
  useResourcesIndexQuery(
    { firstKey: "band", secondKey: "musics", fn: getBandMusics },
    args
  );

export const useBandAlbumsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IAlbum>> =>
  useResourcesIndexQuery(
    { firstKey: "band", secondKey: "albums", fn: getBandAlbums },
    args
  );

export const useArtistAlbumsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IAlbum>> =>
  useResourcesIndexQuery(
    { firstKey: "artist", secondKey: "albums", fn: getArtistAlbums },
    args
  );

export const useArtistMusicsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IMusic>> =>
  useResourcesIndexQuery(
    { firstKey: "artist", secondKey: "musics", fn: getArtistMusics },
    args
  );

export const useUserFollowingQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IUser>> =>
  useResourcesIndexQuery(
    { firstKey: "user", secondKey: "following", fn: getUserFollowing },
    args
  );

export const useUserFollowerQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IUser>> =>
  useResourcesIndexQuery(
    { firstKey: "user", secondKey: "follower", fn: getUserFollower },
    args
  );

export const useUserMusicsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IMusic>> =>
  useResourcesIndexQuery(
    { firstKey: "user", secondKey: "musics", fn: getUserMusics },
    args
  );

export const useUserNotificationsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<INotification>> =>
  useResourcesIndexQuery(
    { firstKey: "user", secondKey: "notifications", fn: getUserNotifications },
    args
  );

export const useAlbumMusicsQuery = (
  args: ResourcesIndexQueryFnArgs
): UseQueryResult<IIndexType<IMusic>> =>
  useResourcesIndexQuery(
    { firstKey: "album", secondKey: "musics", fn: getAlbumMusics },
    args
  );

function useShowQuery<T>(
  query: {
    key: string;
    fn: (fnArgs: ShowQueryFnArgs<T>) => () => Promise<T>;
  },
  args: ShowQueryFnArgs<T>
): UseQueryResult<T> {
  const { id, locale, options } = args;
  const { key, fn } = query;
  const { onError } = useQuerySnackbar();
  return useQuery([key, id, locale], fn(args), {
    ...options,
    onError,
  });
}

export const useUserQuery = (
  args: ShowQueryFnArgs<IUser>
): UseQueryResult<IUser> => useShowQuery({ key: "user", fn: getUser }, args);

export const useMusicQuery = (
  args: ShowQueryFnArgs<IMusic>
): UseQueryResult<IMusic> => useShowQuery({ key: "music", fn: getMusic }, args);

export const useMusicScoreQuery = (
  args: ShowQueryFnArgs<IMusic>
): UseQueryResult<IMusic> =>
  useShowQuery({ key: "musicScore", fn: getMusicScore }, args);

export const useMusicBlobQuery = (
  args: ShowQueryFnArgs<IMusic>
): UseQueryResult<IMusic> =>
  useShowQuery({ key: "musicBlob", fn: getMusicBlob }, args);

export const useMusicTreeQuery = (
  args: ShowQueryFnArgs<IMusic>
): UseQueryResult<IMusic> =>
  useShowQuery({ key: "musicTree", fn: getMusicTree }, args);

export const useMusicRootTreeQuery = (
  args: ShowQueryFnArgs<IMusic>
): UseQueryResult<IMusic> =>
  useShowQuery({ key: "musicRootTree", fn: getMusicRootTree }, args);

export const useAlbumQuery = (
  args: ShowQueryFnArgs<IAlbum>
): UseQueryResult<IAlbum> => useShowQuery({ key: "album", fn: getAlbum }, args);

export const useArtistQuery = (
  args: ShowQueryFnArgs<IArtist>
): UseQueryResult<IArtist> =>
  useShowQuery({ key: "artist", fn: getArtist }, args);

export const useBandQuery = (
  args: ShowQueryFnArgs<IBand>
): UseQueryResult<IBand> => useShowQuery({ key: "band", fn: getBand }, args);

export const useIssueQuery = (
  args: ShowQueryFnArgs<IIssue>
): UseQueryResult<IIssue> => useShowQuery({ key: "issue", fn: getIssue }, args);
