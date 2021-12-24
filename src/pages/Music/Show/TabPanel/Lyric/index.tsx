import React from "react";
import { useQuery, useQueryClient } from "react-query";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getTrackLyric } from "../../../../../axios/musixmatch";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import { IMusic } from "../../../../../interfaces";
import style from "./index.module.css";
import { ShowProps } from "../../interface";

const Lyric: React.FC<ShowProps> = ({ queryKey }: ShowProps) => {
  const { onError } = useQuerySnackbar();
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(queryKey);
  const { data, isLoading } = useQuery(
    ["MUSIXMATCH", music?.link.id],
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
