import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import Image from "material-ui-image";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ControlTextField from "../../components/ControlTextField";
import ControlDropzone from "../../components/ControlDropzone";
import ItunesMusicCard from "../../components/Card/Itunes/Music";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import LoadingButton from "../../components/Loading/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import MusicTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import {
  IItunesMusic,
  IItunesResponse,
  IMusic,
  IMusicsType,
} from "../../interfaces";
import { itunes } from "../../axios";
import routes from "../../router/routes.json";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";
import { useOpen } from "../../common/useOpen";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import queryKey from "../../gql/queryKey.json";
import { graphQLClient } from "../../gql/client";
import { musicsQuery } from "../../gql/query/musics";

const New: React.FC = () => {
  const [page, setPage] = useState(1);
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesMusic,
    setSelectedItunesMusic,
  ] = useState<IItunesMusic>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, watch, setValue, handleSubmit } = useForm<IMusic>();
  const { title } = watch();
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
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
    queryClient.setQueryData([queryKey.MUSIC, id], res.data);
    if (selectedItunesMusic)
      queryClient.setQueryData(
        [queryKey.ITUNES, queryKey.MUSIC, selectedItunesMusic.trackId],
        selectedItunesMusic
      );
  };
  const createMusicMutation = useMutation(
    (newMusic: IMusic) => axios.post<IMusic>(route, newMusic, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.MUSICS, { page, title }],
    () =>
      graphQLClient.request<IMusicsType>(musicsQuery, {
        page,
        q: { title_eq: title },
      }),
    { enabled: !!title, onError }
  );
  const searchItunesQuery = useQuery(
    [queryKey.ITUNES, queryKey.MUSICS, title],
    () =>
      itunes.get<IItunesResponse<IItunesMusic>>("/search", {
        params: {
          entity: "song",
          term: title,
        },
      }),
    { enabled: open, onError }
  );
  // handlers
  const onSubmit = (data: IMusic) => createMusicMutation.mutate(data);
  const handleDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = (e) => setValue("tab", e.target?.result);
    reader.readAsText(acceptedFiles[0]);
  };
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);

  useEffect(() => {
    if (selectedItunesMusic) {
      const { trackCensoredName, trackId } = selectedItunesMusic;
      setValue("title", trackCensoredName);
      setValue("itunes_track_id", trackId);
    }
  }, [selectedItunesMusic]);
  const ItunesMusicsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Music</DialogTitle>
        {searchItunesQuery.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesQuery.data?.data.results.map((itunesMusic) => {
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
    if (!searchQuery.data?.musics.data.length) return null;
    return (
      <>
        <Box my={3}>
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Music Already Existed — <strong>check it out!</strong>
          </Alert>
        </Box>
        <Box mb={3}>
          <MusicTable
            data={searchQuery.data.musics.data}
            page={page}
            pageCount={searchQuery.data?.musics.pagination.totalPages}
            onPage={handlePage}
            loading={searchQuery.isLoading}
          />
        </Box>
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
                  loading={searchQuery.isLoading}
                />
              ),
            }}
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
            onClick={handleOpen}
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
