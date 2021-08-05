import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { IArtistParams, postArtist } from "../../axios/axios";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import ControlTextField from "../../components/ControlTextField/ControlTextField";
import LoadingButton from "../../ui/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import ArtistTable from "../../components/Table/Artist";
import ExistAlert from "../../components/Alert/Exist";
import ItunesArtistDialog from "../../components/Dialog/Itunes/Artist";
import DefaultLayout from "../../layout/Default";
import { setHeaders } from "../../slices/currentUser/currentUser";
import { IArtist, IItunesArtist } from "../../interfaces";
import useOpen from "../../hooks/useOpen";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import usePaginate from "../../hooks/usePaginate";
import { getArtists } from "../../gql";
import { selectLocale } from "../../slices/language";

const New: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const [open, handleOpen, handleClose] = useOpen();
  const [selectedItunesArtist, setSelectedItunesArtist] =
    useState<IItunesArtist>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, register, watch, handleSubmit } =
    useForm<IArtist>();
  const { name } = watch();
  // use-debounce
  const [debouncedInputValue] = useDebounce(name, 1000);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  const locale = useSelector(selectLocale);
  // react-redux
  const dispatch = useDispatch();
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IArtist>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData(
      [queryKey.ARTIST, res.data.id, { musicPage: 1, albumPage: 1 }],
      res.data
    );
    if (selectedItunesArtist)
      queryClient.setQueryData(
        [queryKey.ITUNES, queryKey.ARTIST, selectedItunesArtist.artistId],
        selectedItunesArtist
      );
  };
  const createMutation = useMutation(
    (newArtist: IArtistParams) => postArtist(newArtist),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.ARTISTS, locale, { page, query: debouncedInputValue }],
    getArtists(1, locale, { name_cont: debouncedInputValue }),
    { enabled: !!debouncedInputValue, onError }
  );
  // handlers
  const onSubmit = (data: IArtistParams) => createMutation.mutate(data);
  const handleSelect = (selectedItem: IItunesArtist) =>
    setSelectedItunesArtist(selectedItem);

  useEffect(() => {
    register("link_attributes.itunes");
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("link_attributes.itunes", artistId);
      setValue("name", artistName);
    }
  }, [register, selectedItunesArtist, setValue]);

  return (
    <DefaultLayout>
      <Paper>
        <Box p={3}>
          <ControlTextField
            name="name"
            defaultValue=""
            autoComplete="on"
            label="Name"
            variant="outlined"
            control={control}
            errors={errors}
            disabled={createMutation.isLoading}
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
            onClick={handleOpen}
            disabled={!name}
            fullWidth
            disableElevation
          />
          <ItunesArtistDialog
            defaultValue={name}
            open={open}
            onClose={handleClose}
            onSelect={handleSelect}
          />
          <ExistAlert<IArtist> data={searchQuery.data?.data}>
            <ArtistTable
              artists={searchQuery.data?.data}
              page={page}
              pageCount={searchQuery.data?.pagination.totalPages}
              onPage={handlePage}
              loading={searchQuery.isLoading}
            />
          </ExistAlert>
          <LoadingButton
            color="primary"
            disabled={!name}
            loading={createMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            Create Artist
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
