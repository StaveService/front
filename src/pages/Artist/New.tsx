import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import itunes from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/LoadingButton";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";
import ArtistCard from "../../components/Card/Artist";
import { selectHeaders } from "../../slices/currentUser";
import { search } from "../common/search";
import {
  IArtist,
  IItunesArtist,
  IItunesArtistsResponse,
} from "../../interfaces";
import routes from "../../router/routes.json";

interface IFormValues {
  name: string;
  ["itunes_artist_id"]: number;
}

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itunesArtists, setItunesArtists] = useState<IItunesArtist[]>([]);
  const [itunesLoading, setItunesLoading] = useState(false);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  const headers = useSelector(selectHeaders);
  const searchArtists = (value: string) =>
    search<IArtist[]>(value, routes.ARTISTS, { name_eq: value }, setArtists);
  const onSubmit = (data: SubmitHandler<IFormValues>) => {
    if (!headers) return;
    setLoading(true);
    axios
      .post(routes.ARTISTS, data, headers)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    searchArtists(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
      setItunesLoading(true);
      itunes
        .get<IItunesArtistsResponse>("/search", {
          params: {
            entity: "musicArtist",
            term: (e.target as HTMLInputElement).value,
          },
        })
        .then((res) => setItunesArtists(res.data.results))
        .catch((err) => console.log(err))
        .finally(() => setItunesLoading(false));
    }
  };
  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("name", artistName);
      setValue("itunes_artist_id", artistId);
      searchArtists(artistName);
    }
  }, [selectedItunesArtist]);

  const ItunesMusicsDialog = () => {
    const handleClose = () => setOpen(false);
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Artist</DialogTitle>
        {itunesLoading && <LinearProgress />}
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
    if (!artists.length) return <></>;
    return (
      <Box>
        <Typography>Artist already exists</Typography>
        {artists.map((artist) => (
          <Link
            underline="none"
            key={artist.id}
            component={RouterLink}
            to={`${routes.ARTISTS}/${artist.id}`}
          >
            <ArtistCard artist={artist} />
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
