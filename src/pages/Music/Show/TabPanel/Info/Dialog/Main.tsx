import React, { useContext, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Container from "@material-ui/core/Container";
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
  const params = useParams<{ id: string; userId: string }>();
  const baseRoute = `${routes.USERS}/${params.userId}${routes.MUSICS}/${params.id}`;
  const composerRoute = baseRoute + routes.COMPOSERS;
  const lyristRoute = baseRoute + routes.LYRISTS;
  const bandRoute = baseRoute + routes.BANDS;
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
          setMusic((prev) => (prev ? { ...prev, ...options } : prev));
        })
        .catch((err) => console.log(err));
  };
  const handleRemoveOption = (
    option: IArtist,
    options: Record<string, unknown>,
    route: string
  ) => {
    if (headers)
      axios
        .delete(`${route}/${option.id}`, headers)
        .then((res) => {
          dispatch(setHeaders(res.headers));
          setMusic((prev) => (prev ? { ...prev, ...options } : prev));
        })
        .catch((err) => console.log(err));
  };
  const handleSelectOptionComposer = (option: IArtist, options: IArtist[]) =>
    handleSelectOption(option, { music_composers: options }, composerRoute);
  const handleRemoveOptionComposer = (option: IArtist, options: IArtist[]) =>
    handleRemoveOption(option, { music_composers: options }, composerRoute);
  const handleSelectOptionLyrist = (option: IArtist, options: IArtist[]) =>
    handleSelectOption(option, { music_lyrists: options }, lyristRoute);
  const handleRemoveOptionLyrist = (option: IArtist, options: IArtist[]) =>
    handleRemoveOption(option, { music_lyrists: options }, lyristRoute);
  const handleSelectOptionBand = (option: IBand, options: IBand[]) =>
    handleSelectOption(option, { band: options[0] }, bandRoute);
  const handleRemoveOptionBand = (option: IBand, options: IBand[]) =>
    handleRemoveOption(option, { band: options[0] }, bandRoute);

  return (
    <>
      <Button onClick={handleOpen}>Edit</Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <Container>
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
        </Container>
      </Dialog>
    </>
  );
};

export default Edit;
