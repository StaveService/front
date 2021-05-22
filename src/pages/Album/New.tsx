import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { itunes } from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import AlbumTable from "../../components/Table/Album";
import LoadingButton from "../../components/Loading/LoadingButton";
import ItunesAlbumCard from "../../components/Card/Itunes/Album";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import DefaultLayout from "../../layout/Default";
import {
  IAlbum,
  IAlbumsType,
  IItunesAlbum,
  IItunesResponse,
} from "../../interfaces";
import { selectHeaders, setHeaders } from "../../slices/currentUser";
import { useOpen } from "../../common/useOpen";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { albumsQuery } from "../../gql/query/albums";
import queryKey from "../../gql/queryKey.json";

const New: React.FC = () => {
  const [page, setPage] = useState(1);
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesAlbum,
    setSelectedItunesAlbum,
  ] = useState<IItunesAlbum>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    errors,
    control,
    setValue,
    register,
    watch,
    handleSubmit,
  } = useForm<IAlbum>();
  const { title } = watch();
  const [debouncedTitle] = useDebounce(title, 1000);
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IAlbum>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData([queryKey.ALBUM, res.data.id], res.data);
    if (selectedItunesAlbum)
      queryClient.setQueryData(
        [queryKey.ITUNES, queryKey.MUSIC, selectedItunesAlbum.collectionId],
        selectedItunesAlbum
      );
  };
  const createMutation = useMutation(
    (newAlbum: IAlbum) => axios.post<IAlbum>(route, newAlbum, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.ALBUMS, { page, query: debouncedTitle }],
    () =>
      graphQLClient.request<IAlbumsType>(albumsQuery, {
        page,
        q: { title_eq: debouncedTitle },
      }),
    { enabled: !!debouncedTitle, onError }
  );
  const searchItunesQuery = useQuery(
    [queryKey.ITUNES, queryKey.ALBUMS, debouncedTitle],
    () =>
      itunes.get<IItunesResponse<IItunesAlbum>>("/search", {
        params: {
          entity: "album",
          term: debouncedTitle,
        },
      }),
    { enabled: open, onError }
  );
  // handlers
  const onSubmit = (data: IAlbum) => createMutation.mutate(data);
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  useEffect(() => {
    if (selectedItunesAlbum) {
      const { collectionName, collectionId } = selectedItunesAlbum;
      setValue("title", collectionName);
      register("album_link_attributes.itunes");
      setValue("album_link_attributes.itunes", collectionId);
    }
  }, [selectedItunesAlbum]);

  const ItunesAlbumsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Album</DialogTitle>
        {searchItunesQuery.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesQuery.data?.data.results.map((itunesAlbum) => {
            const handleSelect = () => {
              handleClose();
              setSelectedItunesAlbum(itunesAlbum);
            };
            return (
              <Box key={itunesAlbum.collectionId} mb={2}>
                <ItunesAlbumCard album={itunesAlbum} />
                <Button onClick={handleSelect}>select this Album</Button>
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedArtistCards = () => {
    if (!searchQuery.data?.albums?.data.length) return null;
    return (
      <>
        <Box my={3}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Album Already Existed — <strong>check it out!</strong>
          </Alert>
        </Box>
        <Box mb={3}>
          <AlbumTable
            data={searchQuery.data?.albums.data}
            page={page}
            pageCount={searchQuery.data?.albums.pagination.totalPages}
            onPage={handlePage}
            loading={searchQuery.isLoading}
          />
        </Box>
      </>
    );
  };

  return (
    <DefaultLayout>
      <Paper>
        <Box p={2}>
          <Box height="100px" width="100px" m="auto">
            <Image src={selectedItunesAlbum?.artworkUrl100 || "undefiend"} />
          </Box>
          <Box visibility="hidden">
            <ControlTextField
              type="hidden"
              name="itunes_collection_id"
              defaultValue=""
              autoComplete="on"
              label="itunesCollectionId"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={createMutation.isLoading}
              fullWidth
            />
          </Box>
          <ControlTextField
            name="title"
            defaultValue=""
            autoComplete="on"
            label="Title"
            variant="outlined"
            control={control}
            errors={errors}
            disabled={createMutation.isLoading}
            fullWidth
            InputProps={{
              endAdornment: (
                <LoadingCircularProgress
                  color="inherit"
                  size={20}
                  loading={searchQuery.isLoading}
                />
              ),
            }}
          />
          <SearchItunesButton
            onClick={handleOpen}
            disabled={!title}
            fullWidth
            disableElevation
          />
          <ItunesAlbumsDialog />
          <SearchedArtistCards />
          <LoadingButton
            color="primary"
            loading={createMutation.isLoading}
            disabled={!title}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Create Album
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
