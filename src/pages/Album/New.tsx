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
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Image from "material-ui-image";
import { useMutation, useQueryClient } from "react-query";
import { itunes } from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import ItunesAlbumCard from "../../components/Card/Itunes/Album";
import AlbumCard from "../../components/Card/Album";
import { IAlbum, IItunesAlbum, IItunesResponse } from "../../interfaces";
import { selectHeaders, setHeaders } from "../../slices/currentUser";
import LoadingCircularProgress from "../../components/Loading/LoadingCircularProgress";
import { useOpen } from "../../common/useOpen";

interface IFormValues {
  title: string;
  ["itunes_collection_id"]: number;
}

const New: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  const [
    selectedItunesAlbum,
    setSelectedItunesAlbum,
  ] = useState<IItunesAlbum>();
  // react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // react-router-dom
  const history = useHistory();
  const match = useRouteMatch();
  const route = match.url.replace("/new", "");
  // notistack
  const { enqueueSnackbar } = useSnackbar();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IAlbum>) => {
    dispatch(setHeaders(res.headers));
    history.push(`${route}/${res.data.id}`);
    queryClient.setQueryData(["artists", res.data.id], res.data);
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createMutation = useMutation(
    (newAlbum: IAlbum) => axios.post<IAlbum>(route, newAlbum, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const searchMutation = useMutation(
    (term: string) =>
      axios.get<IAlbum[]>(route, {
        params: { q: { name_eq: term } },
      }),
    { onError }
  );
  const searchItunesMutation = useMutation(
    (term: string) =>
      itunes.get<IItunesResponse<IItunesAlbum>>("/search", {
        params: {
          entity: "album",
          term,
        },
      }),
    { onError }
  );
  // handlers
  const onSubmit = (data: IAlbum) => createMutation.mutate(data);
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
    if (selectedItunesAlbum) {
      const { collectionName, collectionId } = selectedItunesAlbum;
      setValue("title", collectionName);
      setValue("itunes_collection_id", collectionId);
      searchMutation.mutate(collectionName);
    }
  }, [selectedItunesAlbum]);

  const ItunesAlbumsDialog = () => {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Choose Album</DialogTitle>
        {searchItunesMutation.isLoading && <LinearProgress />}
        <Box p={2}>
          {searchItunesMutation.data?.data.results.map((itunesAlbum) => {
            const handleClick = () => {
              handleClose();
              setSelectedItunesAlbum(itunesAlbum);
            };
            return (
              <Box key={itunesAlbum.collectionId} mb={2}>
                <ItunesAlbumCard album={itunesAlbum} />
                <Button onClick={handleClick}>select this Album</Button>
              </Box>
            );
          })}
        </Box>
      </Dialog>
    );
  };
  const SearchedArtistsCard = () => {
    if (!searchMutation.data?.data.length) return null;
    return (
      <Box>
        <Typography>Album already exists</Typography>
        {searchMutation.data?.data.map((album) => (
          <Link
            underline="none"
            key={album.id}
            component={RouterLink}
            to={`${route}/${album.id}`}
          >
            <AlbumCard album={album} />
          </Link>
        ))}
      </Box>
    );
  };

  return (
    <Container>
      <Paper>
        <Box p={2}>
          <Box height="100px" width="100px" m="auto">
            <Image src={selectedItunesAlbum?.artworkUrl100 || "undefiend"} />
          </Box>
          <Box visibility="hidden">
            <ControlTextField
              type="hidden"
              name="itunes_collection_id"
              defaultValue=""
              autoComplete="on"
              label="itunesCollectionId"
              variant="outlined"
              control={control}
              errors={errors}
              disabled={createMutation.isLoading}
              fullWidth
            />
          </Box>
          <ControlTextField
            name="title"
            defaultValue=""
            autoComplete="on"
            label="Title"
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
            Create Album
          </LoadingButton>
        </Box>
      </Paper>
      <ItunesAlbumsDialog />
    </Container>
  );
};

export default New;
