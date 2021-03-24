import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Image from "material-ui-image";
import itunesSearch from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import {
  IItunesMusic,
  IItunesMusicsResponse,
  INewMusicFormValues,
} from "../../interfaces";
import MusicCard from "../../components/Card/Music";
import LoadingButton from "../../components/LoadingButton";
import routes from "../../router/routes.json";
import { selectCurrentUser } from "../../slices/currentUser";

interface IFormValues {
  title: string;
  bpm: number;
  album: string;
  band: string;
  ["itunes_artwork_url"]: string;
  ["release_date"]: string;
}

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itunesLoading, setItunesLoading] = useState(false);
  const [musics, setMusics] = useState<IItunesMusic[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<IItunesMusic>();
  const [checked, setChecked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    errors,
    control,
    watch,
    setValue,
    handleSubmit,
  } = useForm<IFormValues>();
  // eslint-disable-next-line camelcase
  const { itunes_artwork_url } = watch();
  const currentUser = useSelector(selectCurrentUser);
  const onSubmit = (data: SubmitHandler<INewMusicFormValues>) => {
    console.log(data);
    setLoading(true);
    axios
      .post(`${routes.USERS}/${currentUser?.id || "undefiend"}${routes.MUSICS}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setChecked(event.target.checked);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
      setItunesLoading(true);
      itunesSearch
        .get<IItunesMusicsResponse>("/search", {
          params: {
            entity: "song",
            term: (e.target as HTMLInputElement).value,
          },
        })
        .then((res) => setMusics(res.data.results))
        .catch((err) => console.log(err))
        .finally(() => setItunesLoading(false));
    }
  };
  useEffect(() => {
    if (selectedMusic) {
      setValue("title", selectedMusic.trackCensoredName);
      setValue("itunes_artwork_url", selectedMusic.artworkUrl100);
      setValue("album", selectedMusic.collectionCensoredName);
      setValue("band", selectedMusic.artistName);
      setValue(
        "release_date",
        format(new Date(selectedMusic.releaseDate), "yyyy-MM-dd")
      );
    }
  }, [selectedMusic]);
  const MusicsDialog = () => {
    const handleClose = () => {
      setOpen(false);
      setMusics([]);
    };
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Music</DialogTitle>
        {itunesLoading && <LinearProgress />}
        <Box p={2}>
          {musics.map((music) => {
            const handleClick = () => {
              handleClose();
              setSelectedMusic(music);
            };
            return (
              <Box key={music.trackId} mb={2} onClick={handleClick}>
                <MusicCard
                  artistName={music.artistName}
                  itunesImg={music.artworkUrl100}
                  collectionCensoredName={music.collectionCensoredName}
                  trackCensoredName={music.trackCensoredName}
                />
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  return (
    <Container maxWidth="xs">
      <Paper>
        <Box p={3}>
          <form>
            <Box height="100px" width="100px" m="auto">
              {/* eslint-disable-next-line camelcase */}
              {itunes_artwork_url && <Image src={itunes_artwork_url} />}
            </Box>
            <Box visibility="hidden">
              <ControlTextField
                type="hidden"
                name="itunes_artwork_url"
                defaultValue=""
                autoComplete="on"
                label="Image"
                variant="outlined"
                control={control}
                errors={errors}
                disabled={loading}
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
              disabled={loading}
              fullWidth
              onKeyPress={handleKeyPress}
            />
            <ControlTextField
              name="bpm"
              defaultValue=""
              autoComplete="on"
              label="BPM"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={loading}
              fullWidth
            />
            <ControlTextField
              name="album"
              defaultValue=""
              autoComplete="on"
              label="Album"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={loading}
              fullWidth
            />
            <ControlTextField
              type="date"
              name="release_date"
              defaultValue=""
              autoComplete="on"
              label="ReleaseDate"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={loading}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <ControlTextField
              name="band"
              defaultValue=""
              autoComplete="on"
              label="band"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={loading}
              fullWidth
            />
          </form>
        </Box>
        <Accordion square>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>Option</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box width="100%">
              <FormControlLabel
                control={<Checkbox color="primary" onChange={handleChange} />}
                label="if created by band, please checked box"
              />
              <Box width="100%" visibility={checked ? "visible" : "hidden"} />
            </Box>
          </AccordionDetails>
        </Accordion>
        <LoadingButton
          type="button"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Create Music
        </LoadingButton>
        <MusicsDialog />
      </Paper>
    </Container>
  );
};

export default New;
