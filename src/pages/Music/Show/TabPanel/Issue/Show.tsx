import axios from "axios";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "react-query";
import { IIssue } from "../../../../../interfaces";
import LoadingCircularProgress from "../../../../../components/Loading/LoadingCircularProgress";

const Show: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { data, isLoading } = useQuery<IIssue>(
    ["issues", match.params.id],
    () => axios.get<IIssue>(match.url).then((res) => res.data),
    { onError }
  );
  return (
    <>
      <LoadingCircularProgress loading={isLoading} />
      <Typography variant="h3">{data?.title}</Typography>
      <Typography>{data?.description}</Typography>
    </>
  );
};
export default Show;
