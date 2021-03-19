import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink, useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import { IUser } from "../../interfaces";
import routes from "../../router/routes.json";

const Show: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    axios
      .get<IUser>(`/users/${params.id}`)
      .then((res) => setUser(res.data))
      // TODO:
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, []);
  if (!user?.id) return <CircularProgress />;
  return (
    <Container>
      <Typography variant="h3">{user.nickname}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Music</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.musics?.map((music) => (
              <TableRow key={music.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USER}${user.id}${routes.MUSIC}${music.id}`}
                  >
                    {music.title}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Show;
