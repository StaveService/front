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
import { IBand } from "../../interfaces";
import routes from "../../constants/routes.json";

interface BandProps {
  data: IBand[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
}
const Band: React.FC<BandProps> = ({
  data,
  page,
  pageCount,
  onPage,
  loading,
}: BandProps) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Link component={RouterLink} to={`${routes.BANDS}`}>
                  Band
                </Link>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((band) => (
              <TableRow key={band.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${band.id}`}
                  >
                    {band.name}
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
Band.defaultProps = {
  page: undefined,
  pageCount: undefined,
  onPage: undefined,
  loading: false,
};
export default Band;
