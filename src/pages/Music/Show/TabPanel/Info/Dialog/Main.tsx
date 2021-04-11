import React, { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { Box } from "@material-ui/core";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import routes from "../../../../../../router/routes.json";
import MusicContext from "../../../context";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../slices/currentUser";
import { IArtist, IBand } from "../../../../../../interfaces";

const Edit: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { music, setMusic } = useContext(MusicContext);
  const headers = useSelector(selectHeaders);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleSelectOption = (
    option: IArtist,
    options: Record<string, unknown>,
    route: string
  ) => {
    if (headers)
      axios
        .post(route, option, headers)
        .then((res) => {
          dispatch(setHeaders(res.headers));
          setMusic((prev) => prev && { ...prev, ...options });
        })
        .catch((err) => enqueueSnackbar(String(err), { variant: "error" }));
  };
  const handleRemoveOption = (
    option: IArtist,
    options: Record<string, unknown>,
    route: string
  ) => {
    if (headers)
      axios
        .delete(`${location.pathname}${route}/${option.id}`, headers)
        .then((res) => {
          dispatch(setHeaders(res.headers));
          setMusic((prev) => prev && { ...prev, ...options });
        })
        .catch((err) => enqueueSnackbar(String(err), { variant: "error" }));
  };
  const handleSelectOptionComposer = (option: IArtist, options: IArtist[]) =>
    handleSelectOption(option, { music_composers: options }, routes.COMPOSERS);
  const handleRemoveOptionComposer = (option: IArtist, options: IArtist[]) =>
    handleRemoveOption(option, { music_composers: options }, routes.COMPOSERS);
  const handleSelectOptionLyrist = (option: IArtist, options: IArtist[]) =>
    handleSelectOption(option, { music_lyrists: options }, routes.LYRISTS);
  const handleRemoveOptionLyrist = (option: IArtist, options: IArtist[]) =>
    handleRemoveOption(option, { music_lyrists: options }, routes.LYRISTS);
  const handleSelectOptionBand = (option: IBand, options: IBand[]) =>
    handleSelectOption(option, { band: options[0] }, routes.BANDS);
  const handleRemoveOptionBand = (option: IBand, options: IBand[]) =>
    handleRemoveOption(option, { band: options[0] }, routes.BANDS);

  return (
    <>
      <Button onClick={handleOpen}>Edit</Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <Container>
          <Box mb={3}>
            <DialogTitle>Edit Info</DialogTitle>
            <AutocompleteTextField
              defaultValue={music?.music_composers}
              searchRoute={routes.ARTISTS}
              property="name"
              query="cont"
              onSelectOption={handleSelectOptionComposer}
              onRemoveOption={handleRemoveOptionComposer}
              textFieldProps={{
                label: "Composers",
                variant: "outlined",
                margin: "normal",
              }}
              autocompleteProps={{ multiple: true }}
            />
            <AutocompleteTextField
              searchRoute={routes.ARTISTS}
              property="name"
              query="cont"
              defaultValue={music?.music_lyrists}
              onSelectOption={handleSelectOptionLyrist}
              onRemoveOption={handleRemoveOptionLyrist}
              textFieldProps={{
                label: "Lyrists",
                variant: "outlined",
                margin: "normal",
              }}
              autocompleteProps={{ multiple: true }}
            />
            <AutocompleteTextField
              defaultValue={music?.band ? [music.band] : []}
              searchRoute={routes.BANDS}
              property="name"
              query="cont"
              maxLength={1}
              onSelectOption={handleSelectOptionBand}
              onRemoveOption={handleRemoveOptionBand}
              textFieldProps={{
                label: "Band",
                variant: "outlined",
                margin: "normal",
              }}
              autocompleteProps={{
                multiple: true,
              }}
            />
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Edit;
