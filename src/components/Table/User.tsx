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
import Pagination from "@material-ui/lab/Pagination";
import TwitterIcon from "../Icon/Twitter";
import LinkIconButton from "../Button/Icon/Link";
import { IUser } from "../../interfaces";
import routes from "../../constants/routes.json";

interface UserProps {
  data: IUser[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
}
const User: React.FC<UserProps> = ({
  data,
  loading,
  page,
  pageCount,
  onPage,
}: UserProps) => (
  <>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link component={RouterLink} to={`${routes.USERS}/${user.id}`}>
                  {user.nickname}
                </Link>
              </TableCell>
              <TableCell />
              <TableCell>
                <LinkIconButton
                  href={
                    user.userLink?.twitter &&
                    `https://twitter.com/${
                      user.userLink?.twitter || "undefined"
                    }`
                  }
                >
                  <TwitterIcon />
                </LinkIconButton>
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
User.defaultProps = {
  page: undefined,
  pageCount: undefined,
  onPage: undefined,
  loading: false,
};
export default User;
