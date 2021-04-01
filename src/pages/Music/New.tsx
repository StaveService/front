import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Image from "material-ui-image";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import itunes from "../../axios";
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
import { search } from "../common/search";

const New: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itunesLoading, setItunesLoading] = useState(false);
  const [itunesMusics, setItunesMusics] = useState<IItunesMusic[]>([]);
  const [
    selectedItunesMusic,
    setSelectedItunesMusic,
  ] = useState<IItunesMusic>();
  const [musics, setMusics] = useState<IMusic[]>([]);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IMusic>();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const onSubmit = (data: SubmitHandler<IMusic>) => {
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
  const searchMusics = (value: string) =>
    search<IMusic[]>(value, routes.MUSICS, { title_cont: value }, setMusics);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    searchMusics(e.target.value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
      setItunesLoading(true);
      itunes
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
      const { trackCensoredName, trackId } = selectedItunesMusic;
      setValue("title", trackCensoredName);
      setValue("itunes_track_id", trackId);
      searchMusics(trackCensoredName);
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
              <Box key={itunesMusic.trackId} mb={2}>
                <ItunesMusicCard music={itunesMusic} />
                <Button onClick={handleClick}>select this Music</Button>
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedMusicCards: React.FC = () => {
    if (!musics.length) return <></>;
    return (
      <Box>
        <Typography>Music already exists</Typography>
        {musics.map((music) => (
          <Link
            underline="none"
            key={music.id}
            component={RouterLink}
            to={`${routes.USERS}/${music.user?.id || "undefined"}${
              routes.MUSICS
            }/${music.id}`}
          >
            <MusicCard music={music} />
          </Link>
        ))}
      </Box>
    );
  };
  return (
    <Container>
      <Paper>
        <Box p={3}>
          <Box height="100px" width="100px" m="auto">
            <Image src={selectedItunesMusic?.artworkUrl100 || "undefiend"} />
          </Box>
          <Box visibility="hidden">
            <ControlTextField
              type="hidden"
              name="itunes_track_id"
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
            onChange={handleChange}
          />
          <SearchedMusicCards />
          <LoadingButton
            type="button"
            loading={loading}
            onClick={handleSubmit(onSubmit)}
          >
            Create Music
          </LoadingButton>
        </Box>
        <ItunesMusicsDialog />
      </Paper>
    </Container>
  );
};

export default New;
