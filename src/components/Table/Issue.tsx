import React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Pagination from "@material-ui/lab/Pagination";
import { IIssue } from "../../interfaces";

interface IssueProps {
  data: IIssue[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
}
const Issue: React.FC<IssueProps> = ({
  data,
  page,
  pageCount,
  onPage,
  loading,
}: IssueProps) => {
  const match = useRouteMatch();
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <Link component={RouterLink} to={`${match.url}/${issue.id}`}>
                    {issue.title}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <LinearProgress />}
      </TableContainer>
      {page && <Pagination count={pageCount} page={page} onChange={onPage} />}
    </>
  );
};
Issue.defaultProps = {
  page: undefined,
  pageCount: undefined,
  onPage: undefined,
  loading: false,
};
export default Issue;
