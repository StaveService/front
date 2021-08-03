import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import Image from "material-ui-image";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ControlTextField from "../../components/ControlTextField/ControlTextField";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import LoadingButton from "../../ui/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import MusicTable from "../../components/Table/Music";
import ExistAlert from "../../components/Alert/Exist";
import DefaultLayout from "../../layout/Default";
import ItunesMusicDialog from "../../components/Dialog/Itunes/Music";
import { IItunesMusic, IMusic } from "../../interfaces";
import { IMusicPostParams, postMusic } from "../../axios/axios";
import {
  selectCurrentUser,
  setHeaders,
} from "../../slices/currentUser/currentUser";
import useOpen from "../../hooks/useOpen";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import routes from "../../constants/routes.json";
import usePaginate from "../../hooks/usePaginate";
import { getMusics } from "../../gql";

const New: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const [open, handleOpen, handleClose] = useOpen();
  const [selectedItunesMusic, setSelectedItunesMusic] =
    useState<IItunesMusic>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, watch, register, setValue, handleSubmit } =
    useForm<IMusic>();
  const { title } = watch();
  // use-debounce
  const [debouncedTitle, { isPending }] = useDebounce(title, 1000);
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
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
    (newMusic: IMusicPostParams) => postMusic(currentUser?.id, newMusic),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.MUSICS, { page, query: debouncedTitle }],
    getMusics(page, { title_eq: debouncedTitle }),
    { enabled: !isPending() && !!debouncedTitle, onError }
  );
  // handlers
  const onSubmit = (data: IMusicPostParams) => createMusicMutation.mutate(data);
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
          <SearchItunesButton
            disabled={!debouncedTitle}
            onClick={handleOpen}
            fullWidth
            disableElevation
          />
          <ItunesMusicDialog
            defaultValue={debouncedTitle}
            open={open}
            onClose={handleClose}
            onSelect={handleSelect}
          />
          <ExistAlert<IMusic> data={searchQuery.data?.data}>
            <MusicTable
              musics={searchQuery.data?.data || []}
              page={page}
              pageCount={searchQuery.data?.pagination.totalPages}
              onPage={handlePage}
              loading={searchQuery.isLoading}
            />
          </ExistAlert>
          <LoadingButton
            color="primary"
            loading={createMusicMutation.isLoading}
            disabled={!debouncedTitle}
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
