import React from "react";
import Box from "@material-ui/core/Box";
import ItunesMusicCard from "../../Card/Itunes/Music";
import { IItunesMusic } from "../../../interfaces";
import CardSearchDialogTest, { DialogProps } from "../CardSearchDialog";
import { searchItunesMusics } from "../../../axios/itunes";
import queryKey from "../../../constants/queryKey.json";

function Music({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IItunesMusic>): JSX.Element {
  return (
    <CardSearchDialogTest<IItunesMusic>
      defaultValue={defaultValue}
      title="Music"
      open={open}
      showSearchBar={showSearchBar}
      useQueryArgs={{
        key: [queryKey.ITUNES, queryKey.MUSICS],
        fn: ({ term, page }) =>
          searchItunesMusics(term, page).then((res) => {
            return {
              data: res.results,
            };
          }),
      }}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.trackId} mb={2} onClick={handleSelect}>
          <ItunesMusicCard music={card} />
        </Box>
      )}
    </CardSearchDialogTest>
  );
}
export default Music;
