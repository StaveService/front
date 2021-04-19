import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { useMutation, useQueryClient } from "react-query";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";
import BandCard from "../../components/Card/Band";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import { selectHeaders, setHeaders } from "../../slices/currentUser";
import { IBand, IItunesArtist, IItunesResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import { itunes } from "../../axios";
import { useOpen } from "../../common/useOpen";

const New: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm();
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const route = match.url.replace("/new", "");
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { enqueueSnackbar } = useSnackbar();
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
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createMutation = useMutation(
    (newBand: IBand) => axios.post<IBand>(route, newBand, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchMutation = useMutation(
    (term: string) =>
      axios.get<IBand[]>(route, {
        params: { name_eq: term },
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
  const handleKeyPress = ({
    target,
    key,
  }: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = target as HTMLInputElement;
    if (key === "Enter" && value) {
      handleOpen();
      searchItunesMusicArtistMutation.mutate(value);
    }
  };
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
              const handleClick = () => {
                handleClose();
                setSelectedItunesArtist(itunesArtist);
              };
              return (
                <Box key={itunesArtist.artistId} mb={2}>
                  <ItunesArtistCard artist={itunesArtist} />
                  <Button onClick={handleClick}>select this Artist</Button>
                </Box>
              );
            }
          )}
        </Box>
      </Dialog>
    );
  };
  const SearchedArtistsCard = () => {
    if (!searchMutation.data?.data.length) return null;
    return (
      <Box>
        <Typography>Band already exists</Typography>
        {searchMutation.data?.data.map((band) => (
          <Link
            underline="none"
            key={band.id}
            component={RouterLink}
            to={`${routes.BANDS}/${band.id}`}
          >
            <BandCard band={band} />
          </Link>
        ))}
      </Box>
    );
  };

  return (
    <Container>
      <Paper>
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
          onKeyPress={handleKeyPress}
          onChange={handleChange}
        />
        <SearchedArtistsCard />
        <LoadingButton
          type="button"
          loading={createMutation.isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          Create Band
        </LoadingButton>
        <Box p={3} />
      </Paper>
      <ItunesMusicsDialog />
    </Container>
  );
};

export default New;
