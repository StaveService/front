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
import { IIssue } from "../../interfaces";

interface IssueProps {
  issues: IIssue[];
  loading: boolean;
}
const Issue: React.FC<IssueProps> = ({ issues, loading }: IssueProps) => {
  const match = useRouteMatch();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.map((issue) => (
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
  );
};
export default Issue;
