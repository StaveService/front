import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import {
  Link as RouterLink,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
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

const Album: React.FC = () => {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IAlbum>();
  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const route = location.pathname + routes.ALBUM_MUSICS;
  const headers = useSelector(selectHeaders);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["musics", match.params.id]);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleRemoveOption = () => setValue("album_id", "");
  const handleSelectOption = (option: IAlbum) =>
    setValue("album_id", option.id);
  const handleCreateSuccess = (res: AxiosResponse<IAlbumMusic>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      ["musics", match.params.id],
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
      ["musics", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          albums:
            prev.albums &&
            prev.albums.filter((prevAlbum) => prevAlbum !== album),
        }
    );
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
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
              loading={createAlbumMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
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
