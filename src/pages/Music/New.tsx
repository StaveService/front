import axios, { AxiosResponse } from "axios";
import React, { KeyboardEvent, ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useSnackbar } from "notistack";
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
import { useMutation, useQueryClient } from "react-query";
import ControlTextField from "../../components/ControlTextField";
import ItunesMusicCard from "../../components/Card/Itunes/Music";
import MusicCard from "../../components/Card/Music";
import LoadingButton from "../../components/Loading/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import { IItunesMusic, IItunesResponse, IMusic } from "../../interfaces";
import { itunes } from "../../axios";
import routes from "../../router/routes.json";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";
import { useOpen } from "../../common/useOpen";

const New: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesMusic,
    setSelectedItunesMusic,
  ] = useState<IItunesMusic>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IMusic>();
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const route = `${routes.USERS}/${currentUser?.id || "undefinde"}${
    routes.MUSICS
  }`;
  // notistack
  const { enqueueSnackbar } = useSnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IMusic>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData(["musics", match.params.id], res.data);
  };
  const handleSearchSuccess = (res: AxiosResponse<IMusic[]>, term: string) => {
    queryClient.setQueryData(["musics", term], res.data);
  };
  const handleItunesSearchSuccess = (
    res: AxiosResponse<IItunesResponse<IItunesMusic>>,
    term: string
  ) => {
    queryClient.setQueryData(["itunesMusics", term], res.data.results);
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createMusicMutation = useMutation(
    (newMusic: IMusic) => axios.post<IMusic>(route, newMusic, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchMutation = useMutation(
    (term: string) =>
      axios.get<IMusic[]>(route, { params: { q: { title_eq: term } } }),
    { onSuccess: handleSearchSuccess, onError }
  );
  const searchItunesMutation = useMutation(
    (term: string) =>
      itunes.get<IItunesResponse<IItunesMusic>>("/search", {
        params: {
          entity: "song",
          term,
        },
      }),
    { onSuccess: handleItunesSearchSuccess, onError }
  );
  // handlers
  const onSubmit = (data: IMusic) => createMusicMutation.mutate(data);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) searchMutation.mutate(e.target.value);
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (e.key === "Enter" && value) {
      handleOpen();
      searchItunesMutation.mutate(value);
    }
  };
  useEffect(() => {
    if (selectedItunesMusic) {
      const { trackCensoredName, trackId } = selectedItunesMusic;
      setValue("title", trackCensoredName);
      setValue("itunes_track_id", trackId);
      searchMutation.mutate(trackCensoredName);
    }
  }, [selectedItunesMusic]);
  const ItunesMusicsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Music</DialogTitle>
        {searchItunesMutation.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesMutation.data?.data.results.map((itunesMusic) => {
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
    if (!searchMutation.data?.data.length) return null;
    return (
      <Box>
        <Typography>Music already exists</Typography>
        {searchMutation.data?.data.map((music) => (
          <Link
            underline="none"
            key={music.id}
            component={RouterLink}
            to={`${route}/${music.id}`}
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
              disabled={createMusicMutation.isLoading}
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
            disabled={createMusicMutation.isLoading}
            fullWidth
            InputProps={{
              endAdornment: (
                <LoadingCircularProgress
                  color="inherit"
                  size={20}
                  loading={searchMutation.isLoading}
                />
              ),
            }}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
          />
          <SearchedMusicCards />
          <LoadingButton
            type="button"
            loading={createMusicMutation.isLoading}
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
