import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
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
    getValues,
    watch,
    handleSubmit,
  } = useForm();
  const { name } = watch();
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
    queryClient.setQueryData(["musics", match.params.id], res.data);
    if (selectedItunesArtist)
      queryClient.setQueryData(
        ["itunesMusics", selectedItunesArtist.artistId],
        selectedItunesArtist
      );
  };
  const createMutation = useMutation(
    (newBand: IBand) => axios.post<IBand>(route, newBand, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchMutation = useMutation(
    (term: string) =>
      graphQLClient.request<IBandsType>(bandsQuery, {
        page,
        params: { q: { name_eq: term } },
      }),
    { onError }
  );
  const searchItunesMusicArtistMutation = useMutation(
    (term: string) =>
      itunes.get<IItunesResponse<IItunesArtist>>("/search", {
        params: {
          entity: "musicArtist",
          term,
        },
      }),
    { onError }
  );
  // handlers
  const onSubmit = (data: IBand) => createMutation.mutate(data);
  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value) searchMutation.mutate(value);
  };
  const handleClick = () => {
    handleOpen();
    searchItunesMusicArtistMutation.mutate(getValues("name"));
  };
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("name", artistName);
      setValue("itunes_artist_id", artistId);
      searchMutation.mutate(artistName);
    }
  }, [selectedItunesArtist]);

  const ItunesMusicsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Artist</DialogTitle>
        {searchItunesMusicArtistMutation.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesMusicArtistMutation.data?.data.results.map(
            (itunesArtist) => {
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
            }
          )}
        </Box>
      </Dialog>
    );
  };
  const SearchedBandCards = () => {
    if (!searchMutation.data?.bands.data.length) return null;
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
            data={searchMutation.data?.bands.data}
            page={page}
            pageCount={searchMutation.data?.bands.pagination.totalPages}
            onPage={handlePage}
            loading={searchMutation.isLoading}
          />
        </Box>
      </>
    );
  };

  return (
    <DefaultLayout>
      <Paper>
        <Box p={3}>
          <Box visibility="hidden">
            <ControlTextField
              type="hidden"
              name="itunes_artist_id"
              defaultValue=""
              autoComplete="on"
              label="Name"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={createMutation.isLoading}
              fullWidth
            />
          </Box>
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
            onChange={handleChange}
          />
          <SearchItunesButton
            onClick={handleClick}
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
