import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import { getIssue } from "../../../../../gql";
import queryKey from "../../../../../constants/queryKey.json";

const Show: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { onError } = useQuerySnackbar();
  const { data, isLoading } = useQuery([queryKey.ISSUE, id], getIssue(id), {
    onError,
  });
  return (
    <>
      {isLoading && <CircularProgress />}
      <Typography variant="h3">{data?.title}</Typography>
      <Typography>{data?.description}</Typography>
    </>
  );
};
export default Show;
