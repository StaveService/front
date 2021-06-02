import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import LinkButton from "../Button/Link";
import TwitterIcon from "../Icon/Twitter";
import ItunesIcon from "../Icon/Itunes";
import { useOpen } from "../../hooks/useOpen";

interface Links {
  twitter?: string;
  itunes?: string;
}
interface Options {
  itunes?: boolean;
  twitter?: boolean;
}
interface LinkProps extends Options {
  links: Links;
  renderItunes: (open: boolean, handleClose: () => void) => React.ReactNode;
}
const Link: React.FC<LinkProps> = ({
  links,
  itunes,
  twitter,
  renderItunes,
}: LinkProps) => {
  const { open, handleClose, handleOpen } = useOpen();
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
          {twitter && (
            <TableRow>
              <TableCell>
                <LinkButton startIcon={<TwitterIcon />} href={links.twitter}>
                  twitter
                </LinkButton>
              </TableCell>
            </TableRow>
          )}
          {itunes && (
            <TableRow>
              <TableCell>
                <LinkButton startIcon={<ItunesIcon />} href={links.itunes}>
                  itunes
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={handleOpen}>
                  Edit
                </Button>

                {renderItunes(open, handleClose)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
Link.defaultProps = {
  itunes: false,
  twitter: false,
};
export default Link;
