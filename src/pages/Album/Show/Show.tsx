import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { IAlbum, IItunesAlbum, IItunesResponse } from "../../../interfaces";
import routes from "../../../router/routes.json";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import ArtistDialog from "./Dialog/Artist";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState<IAlbum>();
  const [itunesMusic, setItunesMusic] = useState<IItunesAlbum>();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IAlbum>(`${routes.ALBUMS}/${params.id}`)
      .then((res) => setAlbum(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
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
