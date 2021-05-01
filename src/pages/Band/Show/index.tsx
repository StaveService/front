import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GroupIcon from "@material-ui/icons/Group";
import ArtistDialog from "./Dialog/Artist";
import AlbumDialog from "./Dialog/Album";
import ArtistsTable from "../../../components/Table/Artist";
import MusicsTable from "../../../components/Table/Music";
import AlbumsTable from "../../../components/Table/Album";
import DefaultLayout from "../../../layout/Default";
import { IBand } from "../../../interfaces";
import { useQuerySnackbar } from "../../../common/useQuerySnackbar";

const Show: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IBand>(
    ["bands", match.params.id],
    () => axios.get<IBand>(match.url).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <Typography variant="h5">
        <GroupIcon />
        {data?.name}
      </Typography>
      <Box mb={3}>
        <ArtistDialog />
        <ArtistsTable artists={data?.artists || []} loading={isLoading} />
      </Box>
      <Box mb={3}>
        <MusicsTable musics={data?.musics || []} loading={isLoading} />
      </Box>
      <Box mb={3}>
        <AlbumDialog />
        <AlbumsTable albums={data?.albums || []} loading={isLoading} />
      </Box>
    </DefaultLayout>
  );
};

export default Show;
