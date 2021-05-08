import axios from "axios";
import React from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { useQuery } from "react-query";
import { IAlbum, IItunesAlbum, IItunesResponse } from "../../../interfaces";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import DefaultLayout from "../../../layout/Default";
import ArtistDialog from "./Dialog/Artist";
import { itunes } from "../../../axios";
import { useQuerySnackbar } from "../../../common/useQuerySnackbar";

const Show: React.FC = () => {
  const location = useLocation();
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
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
    <DefaultLayout>
      <Typography variant="h5">
        <AlbumIcon />
        {album.data?.title}
      </Typography>
      <Box height="100px" width="100px" m="auto">
        <Image src={itunesAlbum.data?.artworkUrl100 || "undefiend"} />
      </Box>
      <Box mb={3}>
        <MusicsTable data={album.data?.musics} loading={album.isLoading} />
      </Box>
      <ArtistDialog />
      <ArtistTable
        artists={album.data?.artists || []}
        loading={album.isLoading}
      />
    </DefaultLayout>
  );
};

export default Show;
