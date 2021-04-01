import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AlbumsTable from "../../../../../components/Table/Album";
import EditDialog from "./Dialog/Edit";
import routes from "../../../../../router/routes.json";
import { IItunesMusic, IMusic } from "../../../../../interfaces";

interface IInfo {
  music?: IMusic;
  itunesMusic?: IItunesMusic;
  loading: boolean;
}
const Info: React.FC<IInfo> = ({ music, itunesMusic, loading }: IInfo) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  return (
    <>
      <Button onClick={handleClickOpen}>Edit</Button>
      <EditDialog open={open} setOpen={setOpen} />
      <Box mb={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>ReleaseDate</TableCell>
                <TableCell>
                  {itunesMusic?.releaseDate &&
                    format(new Date(itunesMusic.releaseDate), "yyyy/MM/dd")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Composer</TableCell>
                <TableCell>
                  {music?.music_composers?.map((composer) => (
                    <Link
                      key={composer.id}
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${composer.id}`}
                    >
                      {composer.name}
                    </Link>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lyrists</TableCell>
                <TableCell>
                  {music?.music_lyrists?.map((lyrists) => (
                    <Link
                      key={lyrists.id}
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${lyrists.id}`}
                    >
                      {lyrists.name}
                    </Link>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>BAND</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${music?.band?.id || "undefined"}`}
                  >
                    {music?.band?.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created by</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USERS}/${music?.user?.id || "undefined"}`}
                  >
                    {music?.user?.nickname}
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mb={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Artist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music?.roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.role}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${role.artist.id}`}
                    >
                      {role.artist.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <AlbumsTable albums={music?.albums || []} loading={loading} />
    </>
  );
};
Info.defaultProps = {
  music: undefined,
  itunesMusic: undefined,
};

export default Info;
