import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import BandTable from "../../components/Table/Band";
import DefaultLayout from "../../layout/Default";
import { selectHeaders, setHeaders } from "../../slices/currentUser";
import {
  IBand,
  IBandsType,
  IItunesArtist,
  IItunesResponse,
} from "../../interfaces";
import routes from "../../router/routes.json";
import { itunes } from "../../axios";
import { useOpen } from "../../common/useOpen";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { bandsQuery } from "../../gql/query/bands";
import queryKey from "../../gql/queryKey.json";

const New: React.FC = () => {
  const [page, setPage] = useState(1);
  const { open, handleOpen, handleClose } = useOpen();
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
    watch,
    register,
    handleSubmit,
  } = useForm<IBand>();
  const { name } = watch();
  // use-debounce
  const [debouncedName] = useDebounce(name, 1000);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const route = match.url.replace("/new", "");
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IBand>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${routes.BANDS}/${res.data.id}`);
    queryClient.setQueryData(
      [queryKey.BAND, Number(match.params.id)],
      res.data
    );
    if (selectedItunesArtist)
      queryClient.setQueryData(
        [queryKey.ITUNES, queryKey.ARTIST, selectedItunesArtist.artistId],
        selectedItunesArtist
      );
  };
  const createMutation = useMutation(
    (newBand: IBand) => axios.post<IBand>(route, newBand, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery<IBandsType>(
    [queryKey.BANDS, { page, debouncedName }],
    () =>
      graphQLClient.request(bandsQuery, {
        page,
        q: { name_eq: debouncedName },
      }),
    { enabled: !!debouncedName, onError }
  );
  const searchItunesQuery = useQuery(
    [queryKey.ITUNES, queryKey.ARTISTS, debouncedName],
    () =>
      itunes.get<IItunesResponse<IItunesArtist>>("/search", {
        params: {
          entity: "musicArtist",
          term: debouncedName,
        },
      }),
    { enabled: open, onError }
  );
  // handlers
  const onSubmit = (data: IBand) => createMutation.mutate(data);
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);

  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      register("band_link_attributes.itunes");
      setValue("band_link_attributes.itunes", artistId);
      setValue("name", artistName);
    }
  }, [selectedItunesArtist]);

  const ItunesMusicsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Artist</DialogTitle>
        {searchItunesQuery.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesQuery.data?.data.results.map((itunesArtist) => {
            const handleSelect = () => {
              handleClose();
              setSelectedItunesArtist(itunesArtist);
            };
            return (
              <Box key={itunesArtist.artistId} mb={2}>
                <ItunesArtistCard artist={itunesArtist} />
                <Button onClick={handleSelect}>select this Artist</Button>
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedBandCards = () => {
    if (!searchQuery.data?.bands?.data.length) return null;
    return (
      <>
        <Box my={3}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Band Already Existed — <strong>check it out!</strong>
          </Alert>
        </Box>
        <Box mb={3}>
          <BandTable
            data={searchQuery.data?.bands.data}
            page={page}
            pageCount={searchQuery.data?.bands.pagination.totalPages}
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
                  loading={createMutation.isLoading}
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
          <ItunesMusicsDialog />
          <SearchedBandCards />
          <LoadingButton
            color="primary"
            loading={createMutation.isLoading}
            disabled={!name}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Create Band
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
