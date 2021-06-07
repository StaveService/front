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

interface LinkProps {
  itunes?: RenderAndLink;
  twitter?: RenderAndLink;
}
interface RenderAndLink {
  link?: string;
  renderDialog: (open: boolean, handleClose: () => void) => React.ReactNode;
}
const Link: React.FC<LinkProps> = ({ itunes, twitter }: LinkProps) => {
  const {
    open: itunesOpen,
    handleClose: handleItunesClose,
    handleOpen: handleItunesOpen,
  } = useOpen();
  const {
    open: twitterOpen,
    handleClose: handleTwitterClose,
    handleOpen: handleTwitterOpen,
  } = useOpen();
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
                <LinkButton
                  startIcon={<TwitterIcon />}
                  href={twitter.link && `https://twitter.com/${twitter.link}`}
                >
                  twitter
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={handleTwitterOpen}>
                  Edit
                </Button>
                {twitter.renderDialog(twitterOpen, handleTwitterClose)}
              </TableCell>
            </TableRow>
          )}
          {itunes && (
            <TableRow>
              <TableCell>
                <LinkButton startIcon={<ItunesIcon />} href={itunes.link}>
                  itunes
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={handleItunesOpen}>
                  Edit
                </Button>

                {itunes.renderDialog(itunesOpen, handleItunesClose)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
Link.defaultProps = {
  itunes: undefined,
  twitter: undefined,
};
export default Link;
