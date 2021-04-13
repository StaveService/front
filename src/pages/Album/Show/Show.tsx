import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { IAlbum, IItunesAlbum, IItunesResponse } from "../../../interfaces";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import ArtistDialog from "./Dialog/Artist";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const [loading, toggleLoading] = useToggle(false);
  const [album, setAlbum] = useState<IAlbum>();
  const [itunesMusic, setItunesMusic] = useState<IItunesAlbum>();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IAlbum>(location.pathname)
      .then((res) => setAlbum(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);
  useEffect(() => {
    if (album)
      itunes
        .get<IItunesResponse<IItunesAlbum>>("/lookup", {
          params: { id: album.itunes_collection_id, entity: "album" },
        })
        .then((res) => setItunesMusic(res.data.results[0]))
        .catch((err) => enqueueSnackbar(String(err), { variant: "error" }));
  }, [album]);
  return (
    <Container>
      <Typography variant="h5">
        <AlbumIcon />
        {album?.title}
      </Typography>
      <Box height="100px" width="100px" m="auto">
        <Image src={itunesMusic?.artworkUrl100 || "undefiend"} />
      </Box>
      <Box mb={3}>
        <MusicsTable musics={album?.musics || []} loading={loading} />
      </Box>
      <ArtistDialog album={album} setAlbum={setAlbum} />
      <ArtistTable artists={album?.artists || []} loading={loading} />
    </Container>
  );
};

export default Show;
