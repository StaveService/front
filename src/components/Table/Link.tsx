import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import { Box } from "@material-ui/core";
import LinkButton from "../Button/Link";
import TwitterIcon from "../Icon/Twitter";
import ItunesIcon from "../Icon/Itunes";
import WikipediaIcon from "../Icon/Wikipedia";
import { useOpen } from "../../hooks/useOpen";

interface RenderAndLink<T> {
  link?: T;
  renderDialog: (open: boolean, handleClose: () => void) => React.ReactNode;
}
interface LinkProps {
  itunes?: RenderAndLink<string>;
  twitter?: RenderAndLink<string>;
  wikipedia?: RenderAndLink<number>;
  musixmatch?: RenderAndLink<number>;
}
const Link: React.FC<LinkProps> = ({
  itunes,
  twitter,
  wikipedia,
  musixmatch,
}: LinkProps) => {
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
  const {
    open: wikipediaOpen,
    handleClose: handleWikipediaClose,
    handleOpen: handleWikipediaOpen,
  } = useOpen();
  const {
    open: musixmatchOpen,
    handleClose: handleMusixmatchClose,
    handleOpen: handleMusixmatchOpen,
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
          {wikipedia && (
            <TableRow>
              <TableCell>
                <LinkButton
                  startIcon={<WikipediaIcon />}
                  href={
                    wikipedia.link
                      ? `https://ja.wikipedia.org/?curid=${wikipedia.link}`
                      : undefined
                  }
                >
                  wikipedia
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={handleWikipediaOpen}>
                  Edit
                </Button>

                {wikipedia.renderDialog(wikipediaOpen, handleWikipediaClose)}
              </TableCell>
            </TableRow>
          )}
          {musixmatch && (
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="cneter">
                  <Box mr={1}>
                    <TextFieldsIcon />
                  </Box>
                  MUSIXMATCH
                </Box>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={handleMusixmatchOpen}>
                  Edit
                </Button>

                {musixmatch.renderDialog(musixmatchOpen, handleMusixmatchClose)}
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
  wikipedia: undefined,
  musixmatch: undefined,
};
export default Link;
