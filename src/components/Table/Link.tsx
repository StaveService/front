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
import { Box, LinearProgress } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import LinkButton from "../Button/Link";
import TwitterIcon from "../Icon/Twitter";
import ItunesIcon from "../Icon/Itunes";
import YoutubeIcon from "../Icon/Youtube";
import WikipediaIcon from "../Icon/Wikipedia";
import SpotifyIcon from "../Icon/Spotify";
import useOpen from "../../hooks/useOpen";

interface RenderAndLink<T> {
  link?: T;
  renderDialog: (open: boolean, handleClose: () => void) => React.ReactNode;
}
interface LinkProps {
  itunes?: RenderAndLink<string>;
  twitter?: RenderAndLink<string | null>;
  spotify?: RenderAndLink<string | null> & { type: string };
  wikipedia?: RenderAndLink<number | null>;
  musixmatch?: RenderAndLink<number>;
  youtube?: {
    type: "v" | "channel";
    link?: string | null;
    renderDialog: (open: boolean, handleClose: () => void) => React.ReactNode;
  };
  loading?: boolean;
}
const Link: React.FC<LinkProps> = ({
  itunes,
  twitter,
  spotify,
  wikipedia,
  musixmatch,
  youtube,
  loading,
}: LinkProps) => {
  const [itunesOpen, onItunesOpen, onItunesClose] = useOpen();
  const [twitterOpen, onTwitterOpen, onTwitterClose] = useOpen();
  const [spotifyOpen, onSpotifyOpen, onSpotifyClose] = useOpen();
  const [wikipediaOpen, onWikipediaOpen, onWikipediaClose] = useOpen();
  const [musixmatchOpen, onMusixmatchOpen, onMusixmatchClose] = useOpen();
  const [youtubeOpen, onYoutubeOpen, onYoutubeClose] = useOpen();
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="link" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="edit" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {twitter && (
            <TableRow>
              <TableCell>
                <LinkButton
                  startIcon={<TwitterIcon />}
                  href={
                    twitter.link
                      ? `https://twitter.com/${twitter.link}`
                      : undefined
                  }
                >
                  twitter
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={onTwitterOpen}>
                  <FormattedMessage id="edit" />
                </Button>
                {twitter.renderDialog(twitterOpen, onTwitterClose)}
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
                <Button variant="text" onClick={onItunesOpen}>
                  <FormattedMessage id="edit" />
                </Button>

                {itunes.renderDialog(itunesOpen, onItunesClose)}
              </TableCell>
            </TableRow>
          )}
          {spotify && (
            <TableRow>
              <TableCell>
                <LinkButton
                  startIcon={<SpotifyIcon />}
                  href={
                    spotify.link
                      ? `https://open.spotify.com/${spotify.type}/${spotify.link}`
                      : undefined
                  }
                >
                  spotify
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={onSpotifyOpen}>
                  <FormattedMessage id="edit" />
                </Button>

                {spotify.renderDialog(spotifyOpen, onSpotifyClose)}
              </TableCell>
            </TableRow>
          )}
          {musixmatch && (
            <TableRow>
              <TableCell>
                <Box display="flex" alignItems="cneter">
                  <Box mr={1}>
                    <TextFieldsIcon
                      color={musixmatch.link ? undefined : "action"}
                    />
                  </Box>
                  MUSIXMATCH
                </Box>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={onMusixmatchOpen}>
                  <FormattedMessage id="edit" />
                </Button>

                {musixmatch.renderDialog(musixmatchOpen, onMusixmatchClose)}
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
                <Button variant="text" onClick={onWikipediaOpen}>
                  <FormattedMessage id="edit" />
                </Button>

                {wikipedia.renderDialog(wikipediaOpen, onWikipediaClose)}
              </TableCell>
            </TableRow>
          )}
          {youtube && (
            <TableRow>
              <TableCell>
                <LinkButton
                  startIcon={<YoutubeIcon />}
                  href={youtube.link || undefined}
                >
                  youtube
                </LinkButton>
              </TableCell>
              <TableCell>
                <Button variant="text" onClick={onYoutubeOpen}>
                  <FormattedMessage id="edit" />
                </Button>

                {youtube.renderDialog(youtubeOpen, onYoutubeClose)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {loading && <LinearProgress />}
    </TableContainer>
  );
};
Link.defaultProps = {
  itunes: undefined,
  twitter: undefined,
  spotify: undefined,
  wikipedia: undefined,
  musixmatch: undefined,
  youtube: undefined,
  loading: false,
};

Link.whyDidYouRender = true;
export default Link;
