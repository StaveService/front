import React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import routes from "../../../../../constants/routes.json";
import IssueTable from "../../../../../components/Table/Issue";
import usePaginate from "../../../../../hooks/usePaginate";
import { useMusicIssuesQuery } from "../../../../../reactQuery/query";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  // const [searchValue, setSearchValue] = useState("");
  const match = useRouteMatch<{ id: string }>();
  const intl = useIntl();
  const handleKeyPress = () =>
    /* e: React.KeyboardEvent<HTMLDivElement> */
    {
      // if (e.key === "Enter") setSearchValue((e.target as HTMLInputElement).value);
    };
  const { data, isLoading } = useMusicIssuesQuery({
    id: Number(match.params.id),
    page,
  });
  return (
    <>
      <Box mb={3}>
        <Grid container>
          <Grid item xs={10}>
            <TextField
              variant="outlined"
              label={intl.formatMessage({ id: "searchIssues" })}
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
              <FormattedMessage id="create" />
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
