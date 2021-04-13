import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useToggle } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";
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
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import AutocompleteTextField from "../../../../components/AutocompleteTextField";
import ControlTextField from "../../../../components/ControlTextField";
import routes from "../../../../router/routes.json";
import { selectHeaders, setHeaders } from "../../../../slices/currentUser";
import { IAlbum, IArtistBand } from "../../../../interfaces";

interface ArtistProps {
  album?: IAlbum;
  setAlbum: Dispatch<SetStateAction<IAlbum | undefined>>;
}
const Artist: React.FC<ArtistProps> = ({ album, setAlbum }: ArtistProps) => {
  const [loading, toggleLoading] = useToggle(false);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IAlbum>();
  const location = useLocation();
  const headers = useSelector(selectHeaders);
  const route = location.pathname + routes.ARTIST_ALBUMS;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleRemoveOption = () => setValue("artist_id", "");
  const handleSelectOption = (option: IAlbum) =>
    setValue("artist_id", option.id);
  const onSubmit = (data: SubmitHandler<IAlbum>) => {
    if (!headers) return;
    toggleLoading();
    axios
      .post<IArtistBand>(route, data, headers)
      .then((res) => {
        dispatch(setHeaders(res.headers));
        setAlbum(
          (prev) =>
            prev && {
              ...prev,
              artists: [...(prev.artists || []), res.data.artist],
            }
        );
      })
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  };
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
                  const handleClick = () => {
                    if (headers)
                      axios
                        .delete(`${route}/${artist.id}`, headers)
                        .then((res) => {
                          dispatch(setHeaders(res.headers));
                          setAlbum(
                            (prev) =>
                              prev && {
                                ...prev,
                                artists:
                                  prev.artists &&
                                  prev.artists.filter(
                                    (prevAlbum) => prevAlbum !== artist
                                  ),
                              }
                          );
                        })
                        .catch((err) =>
                          enqueueSnackbar(String(err), { variant: "error" })
                        );
                  };
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
            <LoadingButton loading={loading} onClick={handleSubmit(onSubmit)}>
              Add Artist
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

Artist.defaultProps = {
  album: undefined,
};
export default Artist;
