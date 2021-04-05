import React, { useContext, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
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
import LoadingButton from "../../../../../../components/Loading/LoadingButton";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import ControlTextField from "../../../../../../components/ControlTextField";
import routes from "../../../../../../router/routes.json";
import MusicContext from "../../../context";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../slices/currentUser";
import { IAlbum } from "../../../../../../interfaces";

const Album: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { music, setMusic } = useContext(MusicContext);
  const params = useParams<{ userId: string; id: string }>();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IAlbum>();
  const route = `${routes.USERS}/${params.userId}${routes.MUSICS}/${params.id}${routes.ALBUMS}`;
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleSelectOption = (option: IAlbum) =>
    setValue("album_id", option.id);
  const handleRemoveOption = () => setValue("album_id", "");
  const onSubmit = (data: SubmitHandler<IAlbum>) => {
    if (!headers) return;
    setLoading(true);
    axios
      .post(route, data, headers)
      .then((res) => {
        dispatch(setHeaders(res.headers));
        // setMusic(
        // (prev) =>
        // prev && { ...prev, roles: [...(prev.roles || []), res.data] }
        // );
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
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
                  <TableCell>Album</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {music?.albums?.map((album) => {
                  const handleClick = () => {
                    // if (headers)
                    // axios
                    // .delete(`${route}/${role.id}`, headers)
                    // .then((res) => {
                    // dispatch(setHeaders(res.headers));
                    // setMusic(
                    // (prev) =>
                    // prev && {
                    // ...prev,
                    // roles:
                    // prev.roles &&
                    // prev.roles.filter(
                    // (prevRole) => prevRole !== role
                    // ),
                    // }
                    // );
                    // })
                    // .catch((err) => console.log(err))
                    // .finally(() => setLoading(false));
                  };
                  return (
                    <TableRow key={album.id}>
                      <TableCell>
                        <Link component={RouterLink} to="/">
                          {album.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={`${routes.ALBUMS}/${album.id}`}
                        >
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
            name="artist_id"
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
            <LoadingButton loading={loading} onClick={handleSubmit(onSubmit)}>
              Add Artist
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Album;
