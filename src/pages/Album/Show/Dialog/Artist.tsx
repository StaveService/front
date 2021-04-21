import axios, { AxiosResponse } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
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
import LoadingButton from "../../../../components/Loading/LoadingButton";
import AutocompleteTextField from "../../../../components/AutocompleteTextField";
import ControlTextField from "../../../../components/ControlTextField";
import routes from "../../../../router/routes.json";
import { selectHeaders, setHeaders } from "../../../../slices/currentUser";
import { IAlbum, IArtist, IArtistAlbum } from "../../../../interfaces";
import { useOpen } from "../../../../common/useOpen";

const Artist: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IAlbum>();
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { enqueueSnackbar } = useSnackbar();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const route = match.url + routes.ARTIST_ALBUMS;
  // react-query
  const queryClient = useQueryClient();
  const album = queryClient.getQueryData<IAlbum>(["albums", match.params.id]);
  const handleCreateSuccess = (res: AxiosResponse<IArtistAlbum>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      ["albums", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          artists: [...(prev.artists || []), res.data.artist],
        }
    );
  };
  const handleDestorySuccess = (res: AxiosResponse, artist: IArtist) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      ["albums", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          artists:
            prev.artists &&
            prev.artists.filter((prevAlbum) => prevAlbum !== artist),
        }
    );
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createMutation = useMutation(
    (newArtistBand: IArtistAlbum) =>
      axios.post<IArtistAlbum>(route, newArtistBand, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    (artist: IArtist) => axios.delete(`${route}/${artist.id}`, headers),
    { onSuccess: handleDestorySuccess, onError }
  );
  const handleRemoveOption = () => setValue("artist_id", "");
  const handleSelectOption = (option: IAlbum) =>
    setValue("artist_id", option.id);
  const onSubmit = (data: IArtistAlbum) => createMutation.mutate(data);
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
                  <TableCell>Artist</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {album?.artists?.map((artist) => {
                  const handleClick = () => destroyMutation.mutate(artist);
                  return (
                    <TableRow key={artist.id}>
                      <TableCell>
                        <Link component={RouterLink} to="/">
                          {artist.name}
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
            name="artist_id"
          />
          <Box mb={3}>
            <AutocompleteTextField
              searchRoute={routes.ARTISTS}
              property="name"
              query="cont"
              onSelectOption={handleSelectOption}
              onRemoveOption={handleRemoveOption}
              textFieldProps={{
                label: "Artist",
                variant: "outlined",
              }}
              autocompleteProps={{ multiple: true }}
            />
          </Box>
          <Box mb={3}>
            <LoadingButton
              color="primary"
              loading={createMutation.isLoading}
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

export default Artist;
