import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";
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
import Link from "@material-ui/core/Link";
import Image from "material-ui-image";
import itunesSearch from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import { IItunesMusic, IItunesMusicsResponse, IMusic } from "../../interfaces";
import ItunesMusicCard from "../../components/Card/Itunes/Music";
import MusicCard from "../../components/Card/Music";
import LoadingButton from "../../components/LoadingButton";
import routes from "../../router/routes.json";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";

interface IFormValues {
  music: {
    title: string;
    bpm: number;
    ["itunes_track_id"]: string;
    ["release_date"]: string;
  };
  album: { title: string };
  band: {
    name: string;
  };
}

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itunesLoading, setItunesLoading] = useState(false);
  const [itunesMusics, setItunesMusics] = useState<IItunesMusic[]>([]);
  const [
    selectedItunesMusic,
    setSelectedItunesMusic,
  ] = useState<IItunesMusic>();
  const [searchedMusics, setSearchedMusics] = useState<IMusic[]>([]);
  const [checked, setChecked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const onSubmit = (data: SubmitHandler<IFormValues>) => {
    console.log(data);
    if (!headers) return;
    setLoading(true);
    axios
      .post(
        `${routes.USERS}/${currentUser?.id || "undefiend"}${routes.MUSICS}`,
        data,
        headers
      )
      .then((res) => {
        dispatch(setHeaders(res.headers));
        history.push(routes.ROOT);
      })
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
        .then((res) => setItunesMusics(res.data.results))
        .catch((err) => console.log(err))
        .finally(() => setItunesLoading(false));
    }
  };
  useEffect(() => {
    if (selectedItunesMusic) {
      const {
        trackCensoredName,
        trackId,
        collectionCensoredName,
        artistName,
        releaseDate,
      } = selectedItunesMusic;
      setValue("music.title", trackCensoredName);
      setValue("music.itunes_track_id", trackId);
      setValue("album.title", collectionCensoredName);
      setValue("band.name", artistName);
      setValue("release_date", format(new Date(releaseDate), "yyyy-MM-dd"));
      axios
        .get("/musics", {
          params: { q: { title_cont: trackCensoredName } },
        })
        .then((res) => setSearchedMusics(res.data))
        .catch((err) => console.log(err));
    }
  }, [selectedItunesMusic]);
  const ItunesMusicsDialog = () => {
    const handleClose = () => setOpen(false);

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Music</DialogTitle>
        {itunesLoading && <LinearProgress />}
        <Box p={2}>
          {itunesMusics.map((itunesMusic) => {
            const handleClick = () => {
              handleClose();
              setSelectedItunesMusic(itunesMusic);
            };
            return (
              <Box key={itunesMusic.trackId} mb={2} onClick={handleClick}>
                <ItunesMusicCard music={itunesMusic} />
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedMusicCards: React.FC = () => {
    if (!searchedMusics.length) return <></>;
    return (
      <Box>
        <Typography>Music already exists</Typography>
        {searchedMusics.map(
          ({
            id,
            title,
            bpm,
            length,
            itunes_track_id: itunesTrackId,
            music_composers: composers,
            music_lyrists: lyrists,
            band,
            user,
          }) => (
            <Link
              underline="none"
              key={id}
              component={RouterLink}
              to={`${routes.USERS}/${user?.id || "undefined"}${
                routes.MUSICS
              }/${id}`}
            >
              <MusicCard
                id={id}
                length={length}
                bpm={bpm}
                title={title}
                itunes_track_id={itunesTrackId}
                music_composers={composers}
                music_lyrists={lyrists}
                band={band}
              />
            </Link>
          )
        )}
      </Box>
    );
  };
  return (
    <Container>
      <Paper>
        <Box p={3}>
          <form>
            <Box height="100px" width="100px" m="auto">
              <Image src={selectedItunesMusic?.artworkUrl100 || "undefiend"} />
            </Box>
            <Box visibility="hidden">
              <ControlTextField
                type="hidden"
                name="music.itunes_track_id"
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
              name="music.title"
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
            <SearchedMusicCards />
            <ControlTextField
              name="music.bpm"
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
              type="date"
              name="music.release_date"
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
              name="album.title"
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
              name="band.name"
              defaultValue=""
              autoComplete="on"
              label="Band"
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
        <ItunesMusicsDialog />
      </Paper>
    </Container>
  );
};

export default New;
