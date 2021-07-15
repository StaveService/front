import React from "react";
import Box from "@material-ui/core/Box";
import ItunesArtistCard from "../../Card/Itunes/Artist";
import { IItunesArtist } from "../../../interfaces";
import CardSearchDialogTest, { DialogProps } from "../CardSearchDialog";
import queryKey from "../../../constants/queryKey.json";
import { searchItunesArtists } from "../../../axios/itunes";

function Artist({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IItunesArtist>): JSX.Element {
  return (
    <CardSearchDialogTest<IItunesArtist>
      defaultValue={defaultValue}
      title="Album"
      open={open}
      showSearchBar={showSearchBar}
      useQueryArgs={{
        key: [queryKey.ITUNES, queryKey.ALBUMS],
        fn: ({ term, page }) =>
          searchItunesArtists(term, page).then((res) => ({
            data: res.results,
          })),
      }}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.artistId} mb={2} onClick={handleSelect}>
          <ItunesArtistCard artist={card} />
        </Box>
      )}
    </CardSearchDialogTest>
  );
}
export default Artist;
