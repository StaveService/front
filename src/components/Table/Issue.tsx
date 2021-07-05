import React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import { IIssue } from "../../interfaces";
import Layout, { LayoutProps } from "./Layout";

interface IssueProps extends LayoutProps {
  issues: IIssue[];
}
const Issue: React.FC<IssueProps> = ({
  issues,
  page,
  pageCount,
  onPage,
  loading,
}: IssueProps) => {
  const match = useRouteMatch();
  return (
    <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issues?.map((issue) => (
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
    </Layout>
  );
};
export default Issue;
