import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getTrackLyric } from "../../../../../axios/musixmatch";
import queryKey from "../../../../../constants/queryKey.json";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import { IMusic } from "../../../../../interfaces";
import style from "./index.module.css";

const Lyric: React.FC = () => {
  const { onError } = useQuerySnackbar();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>([queryKey.MUSIC, id]);
  const { data, isLoading } = useQuery(
    [queryKey.MUSIXMATCH, music?.link.id],
    () => getTrackLyric(music?.link.musixmatch),
    { onError }
  );
  if (isLoading) return <CircularProgress />;
  return (
    <div className={style.lyric}>
      {data?.message?.body?.lyrics?.lyrics_body || ""}
    </div>
  );
};
export default Lyric;
