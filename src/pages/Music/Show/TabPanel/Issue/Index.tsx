import React, { useState } from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import routes from "../../../../../constants/routes.json";
import IssueTable from "../../../../../components/Table/Issue";
import { IIssueType } from "../../../../../interfaces";
import { useQuerySnackbar } from "../../../../../hooks/useQuerySnackbar";
import { graphQLClient } from "../../../../../gql/client";
import queryKey from "../../../../../constants/queryKey.json";
import { issuesQuery } from "../../../../../gql/query/issues";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") setSearchValue((e.target as HTMLInputElement).value);
  };
  const { data, isLoading } = useQuery<IIssueType>(
    searchValue
      ? [queryKey.ISSUES, searchValue, page]
      : [queryKey.ISSUES, page],
    () =>
      graphQLClient.request(issuesQuery, {
        page,
        musicId: Number(match.params.id),
      }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
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
      <IssueTable
        issues={data?.issues?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.issues?.pagination.totalPages}
        onPage={handlePage}
      />
    </>
  );
};
export default Index;
