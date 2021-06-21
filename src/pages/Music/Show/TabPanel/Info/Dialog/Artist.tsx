import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import useDebounce from "use-debounce/lib/useDebounce";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import ControlSelect from "../../../../../../components/ControlSelect";
import LoadingButton from "../../../../../../components/Loading/LoadingButton";
import {
  IArtist,
  IMusic,
  IArtistMusic,
  IArtistsType,
} from "../../../../../../interfaces";
import { addRoleSchema } from "../../../../../../schema";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../slices/currentUser";
import useOpen from "../../../../../../hooks/useOpen";
import { useQuerySnackbar } from "../../../../../../hooks/useQuerySnackbar";
import { graphQLClient } from "../../../../../../gql/client";
import { artistsQuery } from "../../../../../../gql/query/artists";
import routes from "../../../../../../constants/routes.json";
import queryKey from "../../../../../../constants/queryKey.json";

const Artist: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [open, handleOpen, handleClose] = useOpen();
  // use-debounce
  const [debouncedInputValue] = useDebounce(inputValue, 1000);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue, register } = useForm<IArtistMusic>({
    defaultValues: { artist_id: undefined },
    resolver: yupResolver(addRoleSchema),
  });
  // notistack
  const { onError } = useQuerySnackbar();
  // react-router-dom
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const route = match.url + routes.ARTISTS;
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // react-query
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>([queryKey.MUSIC, id]);
  const handleSelectOption = (option: IArtist) =>
    setValue("artist_id", option.id);
  const handleRemoveOption = () => setValue("artist_id", "");
  const handleCreateSuccess = (res: AxiosResponse<IArtistMusic>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) =>
        prev && {
          ...prev,
          artistMusics: [...(prev.artistMusics || []), res.data],
        }
    );
  };
  const handleDestroySuccess = (
    res: AxiosResponse<IArtistMusic>,
    artist: IArtistMusic
  ) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) =>
        prev && {
          ...prev,
          artistMusics:
            prev.artistMusics &&
            prev.artistMusics.filter((prevArtist) => prevArtist !== artist),
        }
    );
  };
  const createRoleMutation = useMutation(
    (newRole: IArtistMusic) =>
      axios.post<IArtistMusic>(route, newRole, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyRoleMutation = useMutation(
    (role: IArtistMusic) =>
      axios.delete<IArtistMusic>(`${route}/${role.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  const artists = useQuery<IArtist[]>(
    [queryKey.ARTISTS, { query: debouncedInputValue }],
    () =>
      graphQLClient
        .request<IArtistsType>(artistsQuery, {
          q: { name_cont: debouncedInputValue },
          page: 1,
        })
        .then((res) => res.artists?.data || []),
    { enabled: !!debouncedInputValue, onError }
  );
  // handlers
  const onInputChange = (
    _e: ChangeEvent<Record<string, unknown>>,
    value: string,
    reason: string
  ) => reason === "input" && setInputValue(value);
  const onSubmit = (data: IArtistMusic) => createRoleMutation.mutate(data);
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
        <DialogTitle>Role</DialogTitle>
        <Container>
          <Box mb={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Artist</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {music?.artistMusics?.map((artistMusic) => {
                    const handleClick = () =>
                      destroyRoleMutation.mutate(artistMusic);
                    return (
                      <TableRow key={artistMusic.id}>
                        <TableCell>
                          <Link component={RouterLink} to="/">
                            {artistMusic.role}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            component={RouterLink}
                            to={`${routes.ARTISTS}/${artistMusic.artist.id}`}
                          >
                            {artistMusic.artist.name}
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
          </Box>
          <Box mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <ControlSelect
                  defaultValue={0}
                  control={control}
                  name="role"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value={0}>Vocal</MenuItem>
                  <MenuItem value={1}>Guitar</MenuItem>
                  <MenuItem value={2}>Base</MenuItem>
                  <MenuItem value={3}>Drum</MenuItem>
                  <MenuItem value={4}>Vocal&Guitar</MenuItem>
                  <MenuItem value={5}>Vocal&Base</MenuItem>
                </ControlSelect>
              </Grid>
              <Grid item xs={9}>
                <AutocompleteTextField<IArtist>
                  maxLength={1}
                  onSelectOption={handleSelectOption}
                  onRemoveOption={handleRemoveOption}
                  textFieldProps={{
                    label: "Artist",
                    variant: "outlined",
                  }}
                  autocompleteProps={{
                    multiple: true,
                    options: artists.data || [],
                    inputValue,
                    getOptionSelected,
                    getOptionLabel,
                    onInputChange,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={3}>
            <LoadingButton
              color="primary"
              loading={createRoleMutation.isLoading}
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
