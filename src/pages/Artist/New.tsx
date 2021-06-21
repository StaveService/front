import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { postArtist } from "../../axios/axios";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import ArtistTable from "../../components/Table/Artist";
import ItunesArtistDialog from "../../components/Dialog/Itunes/Artist";
import DefaultLayout from "../../layout/Default";
import { selectHeaders, setHeaders } from "../../slices/currentUser";
import { IArtist, IArtistsType, IItunesArtist } from "../../interfaces";
import useOpen from "../../hooks/useOpen";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { artistsQuery } from "../../gql/query/artists";
import queryKey from "../../constants/queryKey.json";

const New: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, handleOpen, handleClose] = useOpen();
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    errors,
    control,
    setValue,
    register,
    watch,
    handleSubmit,
  } = useForm<IArtist>();
  const { name } = watch();
  // use-debounce
  const [debouncedName] = useDebounce(name, 1000);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IArtist>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData(
      [queryKey.ARTIST, res.data.id, { musicPage: 1, albumPage: 1 }],
      res.data
    );
    if (selectedItunesArtist)
      queryClient.setQueryData(
        [queryKey.ITUNES, queryKey.ARTIST, selectedItunesArtist.artistId],
        selectedItunesArtist
      );
  };
  const createMutation = useMutation(
    (newArtist: IArtist) => postArtist(newArtist, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.ARTISTS, { page, query: debouncedName }],
    () =>
      graphQLClient.request<IArtistsType>(artistsQuery, {
        page,
        q: { name_eq: debouncedName },
      }),
    { enabled: !!debouncedName, onError }
  );
  // handlers
  const onSubmit = (data: IArtist) => createMutation.mutate(data);
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  const handleSelect = (selectedItem: IItunesArtist) =>
    setSelectedItunesArtist(selectedItem);

  useEffect(() => {
    register("artist_link_attributes.itunes");
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("artist_link_attributes.itunes", artistId);
      setValue("name", artistName);
    }
  }, [register, selectedItunesArtist, setValue]);

  const SearchedArtistsCard = () => {
    if (!searchQuery.data?.artists?.data.length) return <></>;
    return (
      <>
        <Box my={3}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Album Already Existed — <strong>check it out!</strong>
          </Alert>
        </Box>
        <Box mb={3}>
          <ArtistTable
            artists={searchQuery.data?.artists.data}
            page={page}
            pageCount={searchQuery.data?.artists.pagination.totalPages}
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
        <Box p={3}>
          <ControlTextField
            name="name"
            defaultValue=""
            autoComplete="on"
            label="Name"
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
            disabled={!name}
            fullWidth
            disableElevation
          />
          <ItunesArtistDialog
            value={name}
            open={open}
            onClose={handleClose}
            onSelect={handleSelect}
          />
          <SearchedArtistsCard />
          <LoadingButton
            color="primary"
            disabled={!name}
            loading={createMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Create Artist
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
