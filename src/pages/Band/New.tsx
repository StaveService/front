import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
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
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";
import BandCard from "../../components/Card/Band";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import { selectHeaders } from "../../slices/currentUser";
import { IBand, IItunesArtist, IItunesResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import { itunes } from "../../axios";
import { search } from "../../common/search";

interface IFormValues {
  name: string;
  ["itunes_artist_id"]: number;
}

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, toggleLoading] = useToggle(false);
  const [searching, toggleSearching] = useToggle(false);
  const [itunesSearching, toggleItunesSearching] = useToggle(false);
  const [itunesArtists, setItunesArtists] = useState<IItunesArtist[]>([]);
  const [bands, setBands] = useState<IBand[]>([]);
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const headers = useSelector(selectHeaders);
  const onSubmit = (data: SubmitHandler<IFormValues>) => {
    if (!headers) return;
    toggleLoading();
    axios
      .post<IBand>(routes.BANDS, data, headers)
      .then((res) => history.push(`${routes.BANDS}/${res.data.id}`))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  };
  const searchBands = (value: string) =>
    search<IBand>(routes.BANDS, { name_eq: value }, setBands, toggleSearching);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    searchBands(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
      toggleItunesSearching();
      itunes
        .get<IItunesResponse<IItunesArtist>>("/search", {
          params: {
            entity: "musicArtist",
            term: (e.target as HTMLInputElement).value,
          },
        })
        .then((res) => setItunesArtists(res.data.results))
        .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
        .finally(toggleItunesSearching);
    }
  };
  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("name", artistName);
      setValue("itunes_artist_id", artistId);
      searchBands(artistName);
    }
  }, [selectedItunesArtist]);

  const ItunesMusicsDialog = () => {
    const handleClose = () => setOpen(false);
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Artist</DialogTitle>
        {itunesSearching && <LinearProgress />}
        <Box p={2}>
          {itunesArtists.map((itunesArtist) => {
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
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedArtistsCard = () => {
    if (!bands.length) return <></>;
    return (
      <Box>
        <Typography>Band already exists</Typography>
        {bands.map((band) => (
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
              disabled={loading}
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
            disabled={loading}
            fullWidth
            InputProps={{
              endAdornment: (
                <LoadingCircularProgress
                  color="inherit"
                  size={20}
                  loading={searching}
                />
              ),
            }}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
          />
          <SearchedArtistsCard />
          <LoadingButton
            type="button"
            loading={loading}
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
