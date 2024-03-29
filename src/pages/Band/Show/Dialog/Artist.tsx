import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
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
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import useDebounce from "use-debounce/lib/useDebounce";
import LoadingButton from "../../../../ui/LoadingButton";
import AutocompleteTextField from "../../../../components/TextField/AutocompleteTextField";
import routes from "../../../../constants/routes.json";
import {
  selectHeaders,
  setHeaders,
} from "../../../../slices/currentUser/currentUser";
import { IArtist, IArtistBand, IBand } from "../../../../interfaces";
import useOpen from "../../../../hooks/useOpen";
import useQuerySnackbar from "../../../../hooks/useQuerySnackbar";
import { selectLocale } from "../../../../slices/language";
import { useArtistsQuery } from "../../../../reactQuery/query";

const Artist: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [open, handleOpen, handleClose] = useOpen();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, setValue } = useForm<IArtist>();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const route = match.url + routes.ARTISTS;
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  const locale = useSelector(selectLocale);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-query
  const queryClient = useQueryClient();
  const band = queryClient.getQueryData<IBand>(["band", id]);
  const handleCreateSuccess = (res: AxiosResponse<IArtistBand>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      ["band", id],
      (prev) =>
        prev && {
          ...prev,
          artists: [...(prev.artists || []), res.data.artist],
        }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse<IBand>, artist: IArtist) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      ["band", id],
      (prev) =>
        prev && {
          ...prev,
          artists:
            prev.artists &&
            prev.artists.filter((prevArtists) => prevArtists !== artist),
        }
    );
  };
  const createMutation = useMutation(
    (newArtistBand: IArtistBand) =>
      axios.post<IArtistBand>(route, newArtistBand, headers),
    {
      onSuccess: handleCreateSuccess,
      onError,
    }
  );
  const destroyMutation = useMutation(
    (artist) => axios.delete(`${route}/${artist.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  const artists = useArtistsQuery({
    page: 1,
    locale,
    q: { name_cont: debouncedInputValue },
    options: { enabled: !!debouncedInputValue },
  });

  // handlers
  const handleRemoveOption = () => setValue("artist_id", "");
  const handleSelectOption = (option: IArtist) =>
    setValue("artist_id", option.id);
  const onInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string,
    reason: string
  ) => reason === "input" && setInputValue(value);
  const onSubmit = (data: IArtistBand) => createMutation.mutate(data);
  const getOptionSelected = (option: IArtist, value: IArtist) =>
    option.name === value.name;
  const getOptionLabel = (option: IArtist) => option.name;
  useEffect(() => {
    register("artist_id");
  }, [register]);
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
                {band?.artists?.map((artist) => {
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
          <Box mb={3}>
            <AutocompleteTextField<IArtist>
              maxLength={1}
              onSelectOption={handleSelectOption}
              onRemoveOption={handleRemoveOption}
              textFieldProps={{
                label: "Artist",
                variant: "outlined",
                margin: "normal",
              }}
              autocompleteProps={{
                multiple: true,
                options: artists.data?.data || [],
                inputValue,
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
              Add Artist
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Artist;
