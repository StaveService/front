import React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import routes from "../../../../../constants/routes.json";
import IssueTable from "../../../../../components/Table/Issue";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import queryKey from "../../../../../constants/queryKey.json";
import usePaginate from "../../../../../hooks/usePaginate";
import { getIssues } from "../../../../../gql";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  // const [searchValue, setSearchValue] = useState("");
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
  const handleKeyPress = () =>
    /* e: React.KeyboardEvent<HTMLDivElement> */
    {
      // if (e.key === "Enter") setSearchValue((e.target as HTMLInputElement).value);
    };
  const { data, isLoading } = useQuery(
    [queryKey.ISSUES, page],
    getIssues(Number(match.params.id), page),
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
      <IssueTable
        issues={data?.data || []}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </>
  );
};
export default Index;
