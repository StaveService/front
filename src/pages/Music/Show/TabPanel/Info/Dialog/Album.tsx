import axios, { AxiosResponse } from "axios";
import React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
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
import LoadingButton from "../../../../../../components/Loading/LoadingButton";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import ControlTextField from "../../../../../../components/ControlTextField";
import routes from "../../../../../../router/routes.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../slices/currentUser";
import { IAlbum, IAlbumMusic, IMusic } from "../../../../../../interfaces";
import { useOpen } from "../../../../../../common/useOpen";
import { useQuerySnackbar } from "../../../../../../common/useQuerySnackbar";

const Album: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IAlbum>();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const route = match.url + routes.ALBUM_MUSICS;
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["music", match.params.id]);
  const handleCreateSuccess = (res: AxiosResponse<IAlbumMusic>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      ["music", match.params.id],
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
      ["music", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          albums:
            prev.albums &&
            prev.albums.filter((prevAlbum) => prevAlbum !== album),
        }
    );
  };
  const createAlbumMutation = useMutation(
    (newAlbumMusic: IAlbum) =>
      axios.post<IAlbumMusic>(route, newAlbumMusic, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyAlbumMutation = useMutation(
    (album: IAlbum) =>
      axios.delete<IAlbumMusic>(`${route}/${album.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  // handlers
  const handleRemoveOption = () => setValue("album_id", "");
  const handleSelectOption = (option: IAlbum) =>
    setValue("album_id", option.id);
  const onSubmit = (data: IAlbum) => createAlbumMutation.mutate(data);

  return (
    <>
      <Button onClick={handleOpen}>Edit</Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <DialogTitle>Edit Albums</DialogTitle>
        <Container>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Album</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {music?.albums?.map((album) => {
                  const handleClick = () => destroyAlbumMutation.mutate(album);
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
          <ControlTextField
            defaultValue=""
            type="hidden"
            control={control}
            name="album_id"
          />
          <Box mb={3}>
            <AutocompleteTextField
              searchRoute={routes.ALBUMS}
              property="title"
              query="cont"
              onSelectOption={handleSelectOption}
              onRemoveOption={handleRemoveOption}
              textFieldProps={{
                label: "Albums",
                variant: "outlined",
              }}
              autocompleteProps={{ multiple: true }}
            />
          </Box>
          <Box mb={3}>
            <LoadingButton
              color="primary"
              loading={createAlbumMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              Add Artist
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Album;
