import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import Image from "material-ui-image";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ControlTextField from "../../components/ControlTextField";
import ControlDropzone from "../../components/ControlDropzone";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import LoadingButton from "../../components/Loading/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import MusicTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import ItunesMusicDialog from "../../components/Dialog/Itunes/Music";
import { IItunesMusic, IMusic, IMusicsType } from "../../interfaces";
import { postMusic } from "../../axios/axios";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";
import { useOpen } from "../../hooks/useOpen";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import routes from "../../constants/routes.json";
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
  const {
    errors,
    control,
    watch,
    register,
    setValue,
    handleSubmit,
  } = useForm<IMusic>();
  const { title } = watch();
  // use-debounce
  const [debouncedTitle] = useDebounce(title, 1000);
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
    (newMusic: IMusic) => postMusic(currentUser?.id, newMusic, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.MUSICS, { page, query: debouncedTitle }],
    () =>
      graphQLClient.request<IMusicsType>(musicsQuery, {
        page,
        q: { title_eq: debouncedTitle },
      }),
    { enabled: !!debouncedTitle, onError }
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
  const handleSelect = (selectedCard: IItunesMusic) =>
    setSelectedItunesMusic(selectedCard);
  useEffect(() => {
    register("link_attributes.itunes");
    if (selectedItunesMusic) {
      const { trackCensoredName, trackId } = selectedItunesMusic;
      setValue("title", trackCensoredName);
      setValue("link_attributes.itunes", trackId);
    }
  }, [register, selectedItunesMusic, setValue]);

  const SearchedMusicCards: React.FC = () => {
    if (!searchQuery.data?.musics?.data.length) return null;
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
            musics={searchQuery.data.musics.data}
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
          <ItunesMusicDialog
            value={title}
            open={open}
            onClose={handleClose}
            onSelect={handleSelect}
          />
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
