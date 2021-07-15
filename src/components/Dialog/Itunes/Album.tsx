import React from "react";
import Box from "@material-ui/core/Box";
import ItunesAlbumCard from "../../Card/Itunes/Album";
import { IItunesAlbum } from "../../../interfaces";
import CardSearchDialogTest, { DialogProps } from "../CardSearchDialog";
import queryKey from "../../../constants/queryKey.json";
import { searchItunesAlbums } from "../../../axios/itunes";

function Album({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IItunesAlbum>): JSX.Element {
  return (
    <CardSearchDialogTest<IItunesAlbum>
      defaultValue={defaultValue}
      title="Album"
      open={open}
      showSearchBar={showSearchBar}
      useQueryArgs={{
        key: [queryKey.ITUNES, queryKey.ALBUMS],
        fn: ({ term, page }) =>
          searchItunesAlbums(term, page).then((res) => ({
            data: res.results,
          })),
      }}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.collectionId} mb={2} onClick={handleSelect}>
          <ItunesAlbumCard album={card} />
        </Box>
      )}
    </CardSearchDialogTest>
  );
}
export default Album;
