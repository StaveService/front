import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import { IBand } from "../../interfaces";
import routes from "../../constants/routes.json";
import Layout, { LayoutProps } from "./Layout";

interface BandProps extends LayoutProps {
  bands: IBand[];
}
const Band: React.FC<BandProps> = ({
  bands,
  page,
  pageCount,
  onPage,
  loading,
}: BandProps) => {
  return (
    <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
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
          {bands?.map((band) => (
            <TableRow key={band.id}>
              <TableCell>
                <Link component={RouterLink} to={`${routes.BANDS}/${band.id}`}>
                  {band.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
};
export default Band;
