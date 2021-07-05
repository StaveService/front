import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import TwitterIcon from "../Icon/Twitter";
import LinkIconButton from "../Button/Icon/Link";
import { IUser } from "../../interfaces";
import routes from "../../constants/routes.json";
import Layout, { LayoutProps } from "./Layout";

interface UserProps extends LayoutProps {
  users: IUser[] | undefined;
}
const User: React.FC<UserProps> = ({
  users: data,
  page,
  pageCount,
  onPage,
  loading,
}: UserProps) => (
  <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>{/* twitter */}</TableCell>
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
            <TableCell>
              <LinkIconButton href={`https://twitter.com/${user.link.twitter}`}>
                <TwitterIcon />
              </LinkIconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Layout>
);
export default User;
