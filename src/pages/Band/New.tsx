import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import ControlTextField from "../../components/ControlTextField/ControlTextField";
import LoadingButton from "../../ui/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import ItunesArtistDialog from "../../components/Dialog/Itunes/Artist";
import BandTable from "../../components/Table/Band";
import ExistAlert from "../../components/Alert/Exist";
import DefaultLayout from "../../layout/Default";
import { setHeaders } from "../../slices/currentUser/currentUser";
import { IBand, IItunesArtist } from "../../interfaces";
import { IBandParams, postBand } from "../../axios/axios";
import useOpen from "../../hooks/useOpen";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import routes from "../../constants/routes.json";
import usePaginate from "../../hooks/usePaginate";
import { getBands } from "../../gql";
import { selectLocale } from "../../slices/language";

const New: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const [open, handleOpen, handleClose] = useOpen();
  const [selectedItunesArtist, setSelectedItunesArtist] =
    useState<IItunesArtist>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, watch, register, handleSubmit } =
    useForm<IBand>();
  const { name } = watch();
  // use-debounce
  const [debouncedName] = useDebounce(name, 1000);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  // react-redux
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  // react-intl
  const intl = useIntl();
  const handleCreateSuccess = (res: AxiosResponse<IBand>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${routes.BANDS}/${res.data.id}`);
    queryClient.setQueryData(
      [queryKey.BAND, Number(match.params.id), { musicPage: 1, albumPage: 1 }],
      res.data
    );
    if (selectedItunesArtist)
      queryClient.setQueryData(
        [queryKey.ITUNES, queryKey.ARTIST, selectedItunesArtist.artistId],
        selectedItunesArtist
      );
  };
  const createMutation = useMutation(
    (newBand: IBandParams) => postBand(newBand),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useQuery(
    [queryKey.BANDS, locale, { page, query: debouncedName }],
    getBands(page, locale, { name_eq: debouncedName }),
    { enabled: !!debouncedName, onError }
  );
  // handlers
  const onSubmit = (data: IBandParams) => createMutation.mutate(data);
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
            label={intl.formatMessage({ id: "name" })}
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
                  loading={createMutation.isLoading}
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
          <ExistAlert<IBand> data={searchQuery.data?.data}>
            <BandTable
              bands={searchQuery.data?.data || []}
              page={page}
              pageCount={searchQuery.data?.pagination.totalPages}
              onPage={handlePage}
              loading={searchQuery.isLoading}
            />
          </ExistAlert>
          <LoadingButton
            color="primary"
            loading={createMutation.isLoading}
            disabled={!name}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            <FormattedMessage id="createBand" />
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
