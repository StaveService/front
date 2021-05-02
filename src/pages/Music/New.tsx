import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import Image from "material-ui-image";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useMutation, useQueryClient } from "react-query";
import ControlTextField from "../../components/ControlTextField";
import ControlDropzone from "../../components/ControlDropzone";
import ItunesMusicCard from "../../components/Card/Itunes/Music";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import MusicCard from "../../components/Card/Music";
import LoadingButton from "../../components/Loading/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import DefaultLayout from "../../layout/Default";
import { IItunesMusic, IItunesResponse, IMusic } from "../../interfaces";
import { itunes } from "../../axios";
import routes from "../../router/routes.json";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";
import { useOpen } from "../../common/useOpen";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const New: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesMusic,
    setSelectedItunesMusic,
  ] = useState<IItunesMusic>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    errors,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = useForm<IMusic>();
  const { title } = watch();
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
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IMusic>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData(["musics", match.params.id], res.data);
    if (selectedItunesMusic)
      queryClient.setQueryData(
        ["itunesMusic", selectedItunesMusic.trackId],
        selectedItunesMusic
      );
  };
  const createMusicMutation = useMutation(
    (newMusic: IMusic) => axios.post<IMusic>(route, newMusic, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchMutation = useMutation(
    (term: string) =>
      axios.get<IMusic[]>(routes.MUSICS, { params: { q: { title_eq: term } } }),
    { onError }
  );
  const searchItunesMutation = useMutation(
    (term: string) =>
      itunes.get<IItunesResponse<IItunesMusic>>("/search", {
        params: {
          entity: "song",
          term,
        },
      }),
    { onError }
  );
  // handlers
  const onSubmit = (data: IMusic) => {
    createMusicMutation.mutate(data);
  };
  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value) searchMutation.mutate(value);
  };
  const handleClick = () => {
    handleOpen();
    searchItunesMutation.mutate(getValues("title"));
  };
  const handleDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setValue("tab", e.target?.result);
    reader.readAsText(acceptedFiles[0]);
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
            const handleSelect = () => {
              handleClose();
              setSelectedItunesMusic(itunesMusic);
            };
            return (
              <Box key={itunesMusic.trackId} mb={2} onClick={handleSelect}>
                <ItunesMusicCard music={itunesMusic} />
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
      <>
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Music Already Existed — <strong>check it out!</strong>
        </Alert>
        {searchMutation.data?.data.map((music) => (
          <Box mb={3} key={music.id}>
            <Link
              underline="none"
              component={RouterLink}
              to={`${route}/${music.id}`}
            >
              <MusicCard music={music} />
            </Link>
          </Box>
        ))}
      </>
    );
  };
  return (
    <DefaultLayout>
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
            onChange={handleChange}
          />
          <ControlDropzone
            name="tab"
            defaultValue=""
            control={control}
            errors={errors}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onDrop={handleDrop}
          />
          <SearchItunesButton
            disabled={!title}
            onClick={handleClick}
            fullWidth
            disableElevation
          />
          <ItunesMusicsDialog />
          <SearchedMusicCards />
          <LoadingButton
            color="primary"
            loading={createMusicMutation.isLoading}
            disabled={!title}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Create Music
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
