import axios from "axios";
import React, { useState } from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import routes from "../../../../../router/routes.json";
import IssueTable from "../../../../../components/Table/Issue";
import { IIssue } from "../../../../../interfaces";

const Index: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const match = useRouteMatch();
  const ISSUES = match.url.split("/").pop() || "";
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") setSearchValue((e.target as HTMLInputElement).value);
  };
  const { data, isLoading } = useQuery<IIssue[]>(
    searchValue ? [ISSUES, searchValue] : ISSUES,
    () =>
      axios
        .get<IIssue[]>(match.url, {
          params: { q: { title_cont: searchValue } },
        })
        .then((res) => res.data),
    { onError }
  );
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
      <IssueTable issues={data || []} loading={isLoading} />
    </>
  );
};
export default Index;
