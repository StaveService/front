import axios from "axios";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { useQuery } from "react-query";
import { IArtist } from "../../interfaces";
import MusicsTable from "../../components/Table/Music";
import BandsTable from "../../components/Table/Band";
import AlbumsTable from "../../components/Table/Album";
import DefaultLayout from "../../layout/Default";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Show: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IArtist>(
    ["bands", match.params.id],
    () => axios.get<IArtist>(match.url).then((res) => res.data),
    { onError }
  );

  return (
    <DefaultLayout>
      <Typography variant="h5">
        <AccessibilityNewIcon />
        {data?.name}
      </Typography>
      <BandsTable bands={data?.bands || []} loading={isLoading} />
      <Box pb={3} />
      <AlbumsTable albums={data?.albums || []} loading={isLoading} />
      <Box pb={3} />
      <MusicsTable musics={data?.musics || []} loading={isLoading} />
    </DefaultLayout>
  );
};

export default Show;
