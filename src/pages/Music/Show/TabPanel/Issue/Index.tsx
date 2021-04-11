import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import routes from "../../../../../router/routes.json";
import { IIssue } from "../../../../../interfaces";

const Index: React.FC = () => {
  const [issues, setIssues] = useState<IIssue[]>([]);
  const match = useRouteMatch();
  const { enqueueSnackbar } = useSnackbar();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).value)
      console.log(e);
  };
  useEffect(() => {
    axios
      .get(match.url)
      .then((res) => setIssues(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }));
  }, []);
  return (
    <>
      <p>Issues</p>
      <TextField variant="outlined" onKeyPress={handleKeyPress} />
      <Button
        variant="contained"
        component={RouterLink}
        to={match.url + routes.NEW}
      >
        New
      </Button>
    </>
  );
};
export default Index;
