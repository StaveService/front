import React from "react";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import SpotifyTrackCard from "../../Card/Spotify/Track";
import Layout from "./Layout";
import { selectSpotifyToken } from "../../../slices/spotify";
import queryKey from "../../../constants/queryKey.json";
import CardSearchDialogTest, { DialogProps } from "../CardSearchDialog";
import { searchSpotify } from "../../../axios/spotify";
import { ISpotifyTrack } from "../../../interfaces";

function Track({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<ISpotifyTrack>): JSX.Element {
  const spotifyToken = useSelector(selectSpotifyToken);
  return (
    <Layout open={open} onClose={onClose}>
      {({ handleError }) => (
        <CardSearchDialogTest<ISpotifyTrack>
          defaultValue={defaultValue}
          title="Spotify"
          open={open}
          useQueryArgs={{
            key: [queryKey.SPOTIFY, queryKey.ALBUMS],
            fn: ({ term, page }) =>
              searchSpotify<ISpotifyTrack>(
                "track",
                term,
                page,
                spotifyToken?.access_token
              ).then((res) => ({
                data: res.tracks.items,
                page: res.tracks.offset,
                pageCount: Math.floor(res.tracks.total / res.tracks.limit),
              })),
            options: { onError: handleError },
          }}
          showSearchBar={showSearchBar}
          onSelect={onSelect}
          onClose={onClose}
        >
          {(card, handleSelect) => (
            <Box key={card.id} mb={2} onClick={handleSelect}>
              <SpotifyTrackCard track={card} />
            </Box>
          )}
        </CardSearchDialogTest>
      )}
    </Layout>
  );
}

export default Track;
