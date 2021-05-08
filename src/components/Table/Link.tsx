import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import { ILink } from "../../interfaces";

interface LinkProps {
  data: ILink | undefined;
  loading?: boolean;
}
const SocialLink: React.FC<LinkProps> = ({ data, loading }: LinkProps) => {
  console.log(data);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Link</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Twitter</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>iTunes</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {loading && <LinearProgress />}
    </TableContainer>
  );
};
SocialLink.defaultProps = {
  loading: false,
};
export default SocialLink;
