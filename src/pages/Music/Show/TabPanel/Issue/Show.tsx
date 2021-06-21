import axios from "axios";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "react-query";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IIssue } from "../../../../../interfaces";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";

const Show: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
  const { data, isLoading } = useQuery<IIssue>(
    ["issues", match.params.id],
    () => axios.get<IIssue>(match.url).then((res) => res.data),
    { onError }
  );
  return (
    <>
      {isLoading && <CircularProgress />}
      <Typography variant="h3">{data?.title}</Typography>
      <Typography>{data?.description}</Typography>
    </>
  );
};
export default Show;
