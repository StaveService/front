import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import itunesSearch from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/LoadingButton";
import { IItunesArtist, IItunesArtistsResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";

interface IFormValues {
  name: string;
  ["itunes_artist_id"]: number;
}

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itunesArtists, setItunesArtists] = useState<IItunesArtist[]>([]);
  const [itunesLoading, setItunesLoading] = useState(false);
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  const onSubmit = (data: SubmitHandler<IFormValues>) => {
    setLoading(true);
    axios
      .post(routes.ARTISTS, data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
      setItunesLoading(true);
      itunesSearch
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
  const ItunesMusicsDialog = () => {
    const handleClose = () => setOpen(false);
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Music</DialogTitle>
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
  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("name", artistName);
      setValue("itunes_artist_id", artistId);
    }
  }, [selectedItunesArtist]);

  return (
    <Container>
      <Paper>
        <Box p={3}>
          <form>
            <Box visibility="hidden">
              <ControlTextField
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
            />

            <LoadingButton
              type="button"
              loading={loading}
              onClick={handleSubmit(onSubmit)}
            >
              Create Artist
            </LoadingButton>
          </form>
        </Box>
      </Paper>
      <ItunesMusicsDialog />
    </Container>
  );
};

export default New;
