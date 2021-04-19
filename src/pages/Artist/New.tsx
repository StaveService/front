import axios, { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { useMutation, useQueryClient } from "react-query";
import { itunes } from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import ItunesArtistCard from "../../components/Card/Itunes/Artist";
import ArtistCard from "../../components/Card/Artist";
import { selectHeaders, setHeaders } from "../../slices/currentUser";
import { IArtist, IItunesArtist, IItunesResponse } from "../../interfaces";
import { useOpen } from "../../common/useOpen";

interface IFormValues {
  name: string;
  ["itunes_artist_id"]: number;
}

const New: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesArtist,
    setSelectedItunesArtist,
  ] = useState<IItunesArtist>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // notistack
  const { enqueueSnackbar } = useSnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IArtist>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData(["artists", res.data.id], res.data);
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createMutation = useMutation(
    (newArtist: IArtist) => axios.post<IArtist>(route, newArtist, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchMutation = useMutation(
    (term: string) =>
      axios.get<IArtist[]>(route, {
        params: { q: { name_eq: term } },
      }),
    { onError }
  );
  const searchItunesMutation = useMutation(
    (term: string) =>
      itunes.get<IItunesResponse<IItunesArtist>>("/search", {
        params: {
          entity: "musicArtist",
          term,
        },
      }),
    { onError }
  );
  // handlers
  const onSubmit = (data: IArtist) => createMutation.mutate(data);
  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (value) searchMutation.mutate(value);
  };
  const handleKeyPress = ({
    target,
    key,
  }: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = target as HTMLInputElement;
    if (key === "Enter" && value) {
      handleOpen();
      searchItunesMutation.mutate(value);
    }
  };
  useEffect(() => {
    if (selectedItunesArtist) {
      const { artistName, artistId } = selectedItunesArtist;
      setValue("name", artistName);
      setValue("itunes_artist_id", artistId);
      searchMutation.mutate(artistName);
    }
  }, [selectedItunesArtist]);

  const ItunesMusicsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Artist</DialogTitle>
        {searchItunesMutation.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesMutation.data?.data.results.map((itunesArtist) => {
            const handleClick = () => {
              handleClose();
              setSelectedItunesArtist(itunesArtist);
            };
            return (
              <Box key={itunesArtist.artistId} mb={2}>
                <ItunesArtistCard artist={itunesArtist} />
                <Button onClick={handleClick}>select this Artist</Button>
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedArtistsCard = () => {
    if (!searchMutation.data?.data.length) return <></>;
    return (
      <Box>
        <Typography>Artist already exists</Typography>
        {searchMutation.data?.data.map((artist) => (
          <Link
            underline="none"
            key={artist.id}
            component={RouterLink}
            to={`${route}/${artist.id}`}
          >
            <ArtistCard artist={artist} />
          </Link>
        ))}
      </Box>
    );
  };

  return (
    <Container>
      <Paper>
        <Box p={3}>
          <Box visibility="hidden">
            <ControlTextField
              type="hidden"
              name="itunes_artist_id"
              defaultValue=""
              autoComplete="on"
              label="Name"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={createMutation.isLoading}
              fullWidth
            />
          </Box>
          <ControlTextField
            name="name"
            defaultValue=""
            autoComplete="on"
            label="Name"
            variant="outlined"
            control={control}
            errors={errors}
            disabled={createMutation.isLoading}
            fullWidth
            InputProps={{
              endAdornment: (
                <LoadingCircularProgress
                  color="inherit"
                  size={20}
                  loading={searchMutation.isLoading}
                />
              ),
            }}
            onKeyPress={handleKeyPress}
            onChange={handleChange}
          />
          <SearchedArtistsCard />
          <LoadingButton
            type="button"
            loading={createMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Create Artist
          </LoadingButton>
        </Box>
      </Paper>
      <ItunesMusicsDialog />
    </Container>
  );
};

export default New;
