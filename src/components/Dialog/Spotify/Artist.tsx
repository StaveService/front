import React from "react";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import Layout from "./Layout";
import SpotifyArtistCard from "../../Card/Spotify/Artist";
import { selectSpotifyToken } from "../../../slices/spotify";
import queryKey from "../../../constants/queryKey.json";
import CardSearchDialogTest, { DialogProps } from "../CardSearchDialog";
import { searchSpotify } from "../../../axios/spotify";
import { ISpotifyArtist } from "../../../interfaces";

function Track({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<ISpotifyArtist>): JSX.Element {
  const spotifyToken = useSelector(selectSpotifyToken);
  return (
    <Layout open={open} onClose={onClose}>
      {({ handleError }) => (
        <CardSearchDialogTest<ISpotifyArtist>
          defaultValue={defaultValue}
          title="Spotify"
          open={open}
          useQueryArgs={{
            key: [queryKey.SPOTIFY, queryKey.ALBUMS],
            fn: ({ term, page }) =>
              searchSpotify<ISpotifyArtist>(
                "artist",
                term,
                page,
                spotifyToken?.access_token
              ).then((res) => ({
                data: res.artists.items,
                page: res.artists.offset,
                pageCount: Math.floor(res.artists.total / res.artists.limit),
              })),
            options: { onError: handleError },
          }}
          showSearchBar={showSearchBar}
          onSelect={onSelect}
          onClose={onClose}
        >
          {(card, handleSelect) => (
            <Box key={card.id} mb={2} onClick={handleSelect}>
              <SpotifyArtistCard artist={card} />
            </Box>
          )}
        </CardSearchDialogTest>
      )}
    </Layout>
  );
}

export default Track;
