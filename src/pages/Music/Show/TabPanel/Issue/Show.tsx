import axios from "axios";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "react-query";
import { IIssue } from "../../../../../interfaces";
import LoadingCircularProgress from "../../../../../components/Loading/LoadingCircularProgress";
import { useQuerySnackbar } from "../../../../../common/useQuerySnackbar";

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
      <LoadingCircularProgress loading={isLoading} />
      <Typography variant="h3">{data?.title}</Typography>
      <Typography>{data?.description}</Typography>
    </>
  );
};
export default Show;
