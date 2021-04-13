import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import { IIssue } from "../../../../../interfaces";
import LoadingCircularProgress from "../../../../../components/Loading/LoadingCircularProgress";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<IIssue>();
  const match = useRouteMatch();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IIssue>(match.url)
      .then((res) => {
        setIssue(res.data);
      })
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <LoadingCircularProgress loading={loading} />
      <Typography variant="h3">{issue?.title}</Typography>
      <Typography>{issue?.description}</Typography>
    </>
  );
};
export default Show;
