import axios from "axios";
import React from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { useQuery } from "react-query";
import { IAlbum, IItunesAlbum, IItunesResponse } from "../../../interfaces";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import ArtistDialog from "./Dialog/Artist";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const album = useQuery<IAlbum>(
    ["albums", match.params.id],
    () => axios.get<IAlbum>(location.pathname).then((res) => res.data),
    { onError }
  );
  const itunesAlbum = useQuery<IItunesAlbum>(
    ["itunesAlbums", album.data?.itunes_collection_id],
    () =>
      itunes
        .get<IItunesResponse<IItunesAlbum>>("/lookup", {
          params: { id: album.data?.itunes_collection_id, entity: "album" },
        })
        .then((res) => res.data.results[0]),
    { enabled: !!album.data?.itunes_collection_id, onError }
  );
  return (
    <Container>
      <Typography variant="h5">
        <AlbumIcon />
        {album.data?.title}
      </Typography>
      <Box height="100px" width="100px" m="auto">
        <Image src={itunesAlbum.data?.artworkUrl100 || "undefiend"} />
      </Box>
      <Box mb={3}>
        <MusicsTable
          musics={album.data?.musics || []}
          loading={album.isLoading}
        />
      </Box>
      <ArtistDialog />
      <ArtistTable
        artists={album.data?.artists || []}
        loading={album.isLoading}
      />
    </Container>
  );
};

export default Show;
