import { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import useDebounce from "use-debounce/lib/useDebounce";
import LoadingButton from "../../../../../../ui/LoadingButton";
import AutocompleteTextField from "../../../../../../components/TextField/AutocompleteTextField";
import { setHeaders } from "../../../../../../slices/currentUser/currentUser";
import { IAlbum, IAlbumMusic, IMusic } from "../../../../../../interfaces";
import useOpen from "../../../../../../hooks/useOpen";
import useQuerySnackbar from "../../../../../../hooks/useQuerySnackbar";
import {
  deleteAlbumMusic,
  postAlbumMusic,
} from "../../../../../../axios/axios";
import { selectLocale } from "../../../../../../slices/language";
import { useAlbumsQuery } from "../../../../../../reactQuery/query";
import { ShowProps } from "../../../interface";

const Album: React.FC<ShowProps> = ({ queryKey }: ShowProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, handleOpen, handleClose] = useOpen();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, setValue } = useForm();
  // react-router-dom
  const params = useParams<{
    userId: string;
    id: string;
  }>();
  const userId = Number(params.userId);
  const id = Number(params.id);
  // react-redux
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  // react-intl
  const intl = useIntl();
  const music = queryClient.getQueryData<IMusic>(queryKey);
  const handleCreateSuccess = (res: AxiosResponse<IAlbumMusic>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      queryKey,
      (prev) =>
        prev && {
          ...prev,
          albums: [...(prev.albums || []), res.data.album],
        }
    );
  };
  const handleDestroySuccess = (
    res: AxiosResponse<IAlbumMusic>,
    album: IAlbum
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      queryKey,
      (prev) =>
        prev && {
          ...prev,
          albums:
            prev.albums &&
            prev.albums.filter((prevAlbum) => prevAlbum !== album),
        }
    );
  };
  const createMutation = useMutation(
    (newAlbum: IAlbum) => postAlbumMusic(userId, id, newAlbum),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    (album: IAlbum) => deleteAlbumMusic(userId, id, album.id),
    { onSuccess: handleDestroySuccess, onError }
  );
  const albums = useAlbumsQuery({
    page: 1,
    locale,
    q: { title_cont: debouncedInputValue },
    options: { enabled: !!debouncedInputValue },
  });
  // handlers
  const handleRemoveOption = () => setValue("album_id", "");
  const handleSelectOption = (option: IAlbum) =>
    setValue("album_id", option.id);
  const getOptionSelected = (option: IAlbum, value: IAlbum) =>
    option.title === value.title;
  const getOptionLabel = (option: IAlbum) => option.title;
  const onInputChange = (
    e: ChangeEvent<Record<string, unknown>>,
    value: string
  ) => setInputValue(value);
  const onSubmit = (data: IAlbum) => createMutation.mutate(data);
  useEffect(() => {
    register("album_id");
  }, [register]);
  return (
    <>
      <Button onClick={handleOpen}>
        <FormattedMessage id="edit" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <DialogTitle>
          <FormattedMessage id="editAlbum" />
        </DialogTitle>
        <Container>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="artist" />
                  </TableCell>
                  <TableCell align="right">
                    <FormattedMessage id="delete" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {music?.albums?.map((album) => {
                  const handleClick = () => destroyMutation.mutate(album);
                  return (
                    <TableRow key={album.id}>
                      <TableCell>
                        <Link component={RouterLink} to="/">
                          {album.title}
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={handleClick}>
                          <CloseIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mb={3}>
            <AutocompleteTextField
              maxLength={1}
              onSelectOption={handleSelectOption}
              onRemoveOption={handleRemoveOption}
              textFieldProps={{
                label: intl.formatMessage({ id: "albums" }),
                variant: "outlined",
                margin: "normal",
              }}
              autocompleteProps={{
                options: albums.data?.data || [],
                multiple: true,
                loading:
                  createMutation.isLoading ||
                  destroyMutation.isLoading ||
                  isPending(),
                getOptionSelected,
                getOptionLabel,
                onInputChange,
              }}
            />
          </Box>
          <Box mb={3}>
            <LoadingButton
              color="primary"
              loading={createMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              <FormattedMessage id="addAlbum" />
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Album;
