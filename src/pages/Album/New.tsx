import React, { useEffect, useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
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
import { useSelector } from "react-redux";
import itunesSearch from "../../axios";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/LoadingButton";
import ItunesAlbumCard from "../../components/Card/Itunes/Album";
import AlbumCard from "../../components/Card/Album";
import { IAlbum, IItunesAlbum, IItunesAlbumsResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import { selectHeaders } from "../../slices/currentUser";

interface IFormValues {
  title: string;
  ["itunes_collection_id"]: number;
}

const New: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [itunesAlbums, setItunesAlbums] = useState<IItunesAlbum[]>([]);
  const [itunesLoading, setItunesLoading] = useState(false);
  const [
    selectedItunesAlbum,
    setSelectedItunesAlbum,
  ] = useState<IItunesAlbum>();
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm<IFormValues>();
  const headers = useSelector(selectHeaders);
  const onSubmit = (data: SubmitHandler<IFormValues>) => {
    if (!headers) return;
    setLoading(true);
    axios
      .post(routes.ALBUMS, data, headers)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(true);
      setItunesLoading(true);
      itunesSearch
        .get<IItunesAlbumsResponse>("/search", {
          params: {
            entity: "album",
            term: (e.target as HTMLInputElement).value,
          },
        })
        .then((res) => setItunesAlbums(res.data.results))
        .catch((err) => console.log(err))
        .finally(() => setItunesLoading(false));
    }
  };
  useEffect(() => {
    if (selectedItunesAlbum) {
      const { collectionName, collectionId } = selectedItunesAlbum;
      setValue("title", collectionName);
      setValue("itunes_collection_id", collectionId);
      axios
        .get(routes.ALBUMS, { params: { q: { title_eq: collectionName } } })
        .then((res) => setAlbums(res.data))
        .catch((err) => console.log(err));
    }
  }, [selectedItunesAlbum]);

  const ItunesAlbumsDialog = () => {
    const handleClose = () => setOpen(false);
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Album</DialogTitle>
        {itunesLoading && <LinearProgress />}
        <Box p={2}>
          {itunesAlbums.map((itunesAlbum) => {
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
    if (!albums.length) return <></>;
    return (
      <Box>
        <Typography>Album already exists</Typography>
        {albums.map((album) => (
          <Link
            underline="none"
            key={album.id}
            component={RouterLink}
            to={`${routes.ARTISTS}/${album.id}`}
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
              disabled={loading}
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
            disabled={loading}
            fullWidth
            onKeyPress={handleKeyPress}
          />
          <SearchedArtistsCard />
          <LoadingButton
            type="button"
            loading={loading}
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
