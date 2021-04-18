import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
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
import { useMutation } from "react-query";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";
import BandCard from "../../components/Card/Band";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import { selectHeaders } from "../../slices/currentUser";
import { IBand, IItunesArtist, IItunesResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import { itunes } from "../../axios";

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm();
  const history = useHistory();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const headers = useSelector(selectHeaders);
  const route = location.pathname.replace("/new", "");
  const handleCreateBandSuccess = (res: AxiosResponse<IBand>) => {
    history.push(`${routes.BANDS}/${res.data.id}`);
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createBandMutation = useMutation(
    (newBand: IBand) => axios.post<IBand>(route, newBand, headers),
    { onSuccess: handleCreateBandSuccess, onError }
  );
  const searchBandMutation = useMutation(
    (term: { [key: string]: string }) =>
      axios.get<IBand[]>(route, {
        params: { q: term },
      }),
    { onError }
  );
  const searchItunesMusicArtistMutation = useMutation(
    ["itunes", "musicArtist"],
    (term: string) =>
      itunes.get<IItunesResponse<IItunesArtist>>("/search", {
        params: {
          entity: "musicArtist",
          term,
        },
      }),
    { onError }
  );
  const onSubmit = (data: IBand) => createBandMutation.mutate(data);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    searchBandMutation.mutate({
      name_eq: (e.target as HTMLInputElement).value,
    });
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      searchItunesMusicArtistMutation.mutate(
        (e.target as HTMLInputElement).value
      );
  };
  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("name", artistName);
      setValue("itunes_artist_id", artistId);
      searchBandMutation.mutate({ name_eq: artistName });
    }
  }, [selectedItunesArtist]);

  const ItunesMusicsDialog = () => {
    const handleClose = () => setOpen(false);
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
    return (
      <Box>
        <Typography>Band already exists</Typography>
        {searchBandMutation.data?.data.map((band) => (
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
              disabled={createBandMutation.isLoading}
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
            disabled={createBandMutation.isLoading}
            fullWidth
            InputProps={{
              endAdornment: (
                <LoadingCircularProgress
                  color="inherit"
                  size={20}
                  loading={createBandMutation.isLoading}
                />
              ),
            }}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
          />
          <SearchedArtistsCard />
          <LoadingButton
            type="button"
            loading={createBandMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Create Artist
          </LoadingButton>
        </Box>
      </Paper>
      <ItunesMusicsDialog />
    </Container>
  );
};

export default New;
