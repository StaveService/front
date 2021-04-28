import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosResponse } from "axios";
import Container from "@material-ui/core/Container";
import { Box } from "@material-ui/core";
import { useMutation, useQueryClient } from "react-query";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import routes from "../../../../../../router/routes.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../slices/currentUser";
import { IArtist, IBand, IMusic } from "../../../../../../interfaces";
import { useOpen } from "../../../../../../common/useOpen";
import { useQuerySnackbar } from "../../../../../../common/useQuerySnackbar";

const Edit: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  const match = useRouteMatch<{ id: string }>();
  const headers = useSelector(selectHeaders);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["musics", match.params.id]);
  const { onError } = useQuerySnackbar();
  const dispatch = useDispatch();
  const handleSelectOption = (
    option: IArtist,
    options: Record<string, unknown>,
    route: string
  ) => {
    createMutation.mutate({ option, options, route });
  };
  const handleRemoveOption = (
    option: IArtist,
    options: Record<string, unknown>,
    route: string
  ) => destroyMutation.mutate({ option, options, route });
  const handleCreateSuccess = (
    res: AxiosResponse<IArtist>,
    {
      options,
    }: {
      option: IArtist;
      options: Record<string, unknown>;
      route: string;
    }
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      ["musics", match.params.id],
      (prev) => prev && { ...prev, ...options }
    );
  };
  const handleDestroySuccess = (
    res: AxiosResponse<IArtist>,
    {
      options,
    }: {
      option: IArtist;
      options: Record<string, unknown>;
      route: string;
    }
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      ["musics", match.params.id],
      (prev) => prev && { ...prev, ...options }
    );
  };
  const createMutation = useMutation(
    ({
      option,
      route,
    }: {
      option: IArtist;
      options: Record<string, unknown>;
      route: string;
    }) => axios.post<IArtist>(match.url + route, option, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    ({
      option,
      route,
    }: {
      option: IArtist;
      options: Record<string, unknown>;
      route: string;
    }) => axios.delete<IArtist>(`${match.url + route}/${option.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
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
