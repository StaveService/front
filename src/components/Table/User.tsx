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
import { IUser } from "../../interfaces";
import routes from "../../router/routes.json";

interface UserProps {
  users: IUser[];
  loading?: boolean;
}
const User: React.FC<UserProps> = ({ users, loading }: UserProps) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Link component={RouterLink} to={`${routes.USERS}/${user.id}`}>
                {user.nickname}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {loading && <LinearProgress />}
  </TableContainer>
);
User.defaultProps = { loading: false };

export default User;
