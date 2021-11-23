import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import ControlTextField from "../../components/ControlTextField/ControlTextField";
import AlbumTable from "../../components/Table/Album";
import LoadingButton from "../../ui/LoadingButton";
import ItunesAlbumDialog from "../../components/Dialog/Itunes/Album";
import SearchItunesButton from "../../components/Button/Search/Itunes";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import ExistAlert from "../../components/Alert/Exist";
import DefaultLayout from "../../layout/Default";
import { IAlbum, IItunesAlbum } from "../../interfaces";
import { setHeaders } from "../../slices/currentUser/currentUser";
import useOpen from "../../hooks/useOpen";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import routes from "../../constants/routes.json";
import { postAlbum, IAlbumParams } from "../../axios/axios";
import usePaginate from "../../hooks/usePaginate";
import { selectLocale } from "../../slices/language";
import { useAlbumsQuery } from "../../reactQuery/query";

const New: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const [open, handleOpen, handleClose] = useOpen();
  const [selectedItunesAlbum, setSelectedItunesAlbum] =
    useState<IItunesAlbum>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, register, watch, handleSubmit } =
    useForm<IAlbum>();
  const { title } = watch();
  const [debouncedTitle] = useDebounce(title, 1000);
  // react-redux
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  // react-router-dom
  const history = useHistory();
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  // react-intl
  const intl = useIntl();
  const handleCreateSuccess = (res: AxiosResponse<IAlbum>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${routes.ALBUMS}/${res.data.id}`);
    queryClient.setQueryData(["album", res.data.id], res.data);
    if (selectedItunesAlbum)
      queryClient.setQueryData(
        ["itunes", "music", selectedItunesAlbum.collectionId],
        selectedItunesAlbum
      );
  };
  const createMutation = useMutation(
    (newAlbum: IAlbumParams) => postAlbum(newAlbum),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchQuery = useAlbumsQuery({
    page,
    locale,
    q: { title_cont: debouncedTitle },
    options: { enabled: !!debouncedTitle, onError },
  });
  // handlers
  const onSubmit = (data: IAlbumParams) => createMutation.mutate(data);
  const handleSelect = (selectedItem: IItunesAlbum) => {
    setSelectedItunesAlbum(selectedItem);
    const { collectionName, collectionId } = selectedItem;
    setValue("title", collectionName);
    setValue("link_attributes.itunes", collectionId);
  };
  useEffect(() => {
    register("link_attributes.itunes");
  }, [register]);

  return (
    <DefaultLayout>
      <Paper>
        <Box p={2}>
          <Box height="100px" width="100px" m="auto">
            <Image src={selectedItunesAlbum?.artworkUrl100 || "undefiend"} />
          </Box>
          <ControlTextField
            name="title"
            defaultValue=""
            autoComplete="on"
            label={intl.formatMessage({ id: "title" })}
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
            disabled={!title}
            fullWidth
            disableElevation
          />
          <ItunesAlbumDialog
            defaultValue={title}
            open={open}
            onClose={handleClose}
            onSelect={handleSelect}
          />
          <ExistAlert<IAlbum> data={searchQuery.data?.data}>
            <AlbumTable
              albums={searchQuery.data?.data || []}
              page={page}
              pageCount={searchQuery.data?.pagination.totalPages}
              onPage={handlePage}
              loading={searchQuery.isLoading}
            />
          </ExistAlert>
          <LoadingButton
            color="primary"
            loading={createMutation.isLoading}
            disabled={!title}
            onClick={handleSubmit(onSubmit)}
            fullWidth
          >
            <FormattedMessage id="createAlbum" />
          </LoadingButton>
        </Box>
      </Paper>
    </DefaultLayout>
  );
};

export default New;
