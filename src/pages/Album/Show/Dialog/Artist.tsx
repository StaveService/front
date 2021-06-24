import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
import useDebounce from "use-debounce/lib/useDebounce";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import AutocompleteTextField from "../../../../components/AutocompleteTextField";
import routes from "../../../../constants/routes.json";
import { selectHeaders, setHeaders } from "../../../../slices/currentUser";
import {
  IAlbum,
  IArtist,
  IArtistAlbum,
  IArtistsType,
} from "../../../../interfaces";
import useOpen from "../../../../hooks/useOpen";
import useQuerySnackbar from "../../../../hooks/useQuerySnackbar";
import queryKey from "../../../../constants/queryKey.json";
import GraphQLClient from "../../../../gql/client";
import { artistsQuery } from "../../../../gql/query/artists";

const Artist: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [open, handleOpen, handleClose] = useOpen();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, setValue } = useForm();
  // use-debounce
  const [debouncedInputValue, { isPending }] = useDebounce(inputValue, 1000);
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { onError } = useQuerySnackbar();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const route = match.url + routes.ARTISTS;
  // react-query
  const queryClient = useQueryClient();
  const album = queryClient.getQueryData<IAlbum>([queryKey.ALBUM, id]);
  const handleCreateSuccess = (res: AxiosResponse<IArtistAlbum>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      [queryKey.ALBUM, id],
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
      [queryKey.ALBUM, id],
      (prev) =>
        prev && {
          ...prev,
          artists:
            prev.artists &&
            prev.artists.filter((prevAlbum) => prevAlbum !== artist),
        }
    );
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
  const artists = useQuery<IArtist[]>(
    [queryKey.ARTISTS, { query: debouncedInputValue }],
    () =>
      GraphQLClient.request<IArtistsType>(artistsQuery, {
        page: 1,
        q: { name_cont: debouncedInputValue },
      }).then((res) => res.artists?.data || []),
    { enabled: !!debouncedInputValue, onError }
  );
  // handlers
  const handleRemoveOption = () => setValue("artist_id", "");
  const handleSelectOption = (option: IArtist) =>
    setValue("artist_id", option.id);
  const onInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string
  ) => setInputValue(value);
  const onSubmit = (data: IArtistAlbum) => createMutation.mutate(data);
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
          <Box mb={3}>
            <AutocompleteTextField<IArtist>
              onSelectOption={handleSelectOption}
              onRemoveOption={handleRemoveOption}
              textFieldProps={{
                label: "Artist",
                variant: "outlined",
                margin: "normal",
              }}
              autocompleteProps={{
                value: artists.data,
                options: artists.data || [],
                loading:
                  createMutation.isLoading ||
                  destroyMutation.isLoading ||
                  isPending(),
                multiple: true,
                inputValue,
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
