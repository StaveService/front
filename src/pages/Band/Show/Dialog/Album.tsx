import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
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
import { useMutation, useQueryClient } from "react-query";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import AutocompleteTextField from "../../../../components/AutocompleteTextField";
import ControlTextField from "../../../../components/ControlTextField";
import routes from "../../../../router/routes.json";
import { selectHeaders, setHeaders } from "../../../../slices/currentUser";
import { IAlbum, IBand, IBandAlbum } from "../../../../interfaces";

const Album: React.FC = () => {
  const [open, setOpen] = useState(false);
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IAlbum>();
  // notistack
  const { enqueueSnackbar } = useSnackbar();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const route = match.url + routes.BAND_ALBUMS;
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // react-query
  const queryClient = useQueryClient();
  const band = queryClient.getQueryData<IBand>(["bands", match.params.id]);
  const handleCreateSuccess = (res: AxiosResponse<IBandAlbum>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      ["bands", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          albums: [...(prev.albums || []), res.data.album],
        }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse<IBand>, album: IAlbum) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      ["bands", match.params.id],
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
  const createMutation = useMutation(
    (newBandAlbum: IBandAlbum) =>
      axios.post<IBandAlbum>(route, newBandAlbum, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    (album) => axios.delete<IBand>(`${route}/${album.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  // handlers
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleRemoveOption = () => setValue("album_id", "");
  const handleSelectOption = (option: IAlbum) =>
    setValue("album_id", option.id);
  const onSubmit = (data: IBandAlbum) => createMutation.mutate(data);
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
                {band?.albums?.map((album) => {
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
              loading={createMutation.isLoading}
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
