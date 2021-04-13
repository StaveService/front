import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import routes from "../../../../../router/routes.json";
import IssueTable from "../../../../../components/Table/Issue";
import { IIssue } from "../../../../../interfaces";
import { search } from "../../../../../common/search";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<IIssue[]>([]);
  const match = useRouteMatch();
  const { enqueueSnackbar } = useSnackbar();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setIssues([]);
      search<IIssue>(
        match.url,
        { title_eq: (e.target as HTMLInputElement).value },
        setIssues,
        setLoading
      );
    }
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(match.url)
      .then((res) => setIssues(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Box mb={3}>
        <Grid container>
          <Grid item xs={10}>
            <TextField
              variant="outlined"
              label="Search Issues"
              onKeyPress={handleKeyPress}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              component={RouterLink}
              to={match.url + routes.NEW}
            >
              New
            </Button>
          </Grid>
        </Grid>
      </Box>
      <IssueTable issues={issues} loading={loading} />
    </>
  );
};
export default Index;
