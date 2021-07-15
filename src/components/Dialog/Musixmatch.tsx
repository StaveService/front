import React from "react";
import Box from "@material-ui/core/Box";
import CardSearchDialogTest, { DialogProps } from "./CardSearchDialog";
import { IMusixmatchTrack } from "../../interfaces";
import MusixmatchCard from "../Card/Musixcmatch";
import queryKey from "../../constants/queryKey.json";
import { searchTracks } from "../../axios/musixmatch";

function Musixmatch({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IMusixmatchTrack>): JSX.Element {
  return (
    <CardSearchDialogTest<IMusixmatchTrack>
      defaultValue={defaultValue}
      title="Musixmatch"
      open={open}
      useQueryArgs={{
        key: [queryKey.MUSIXMATCH],
        fn: ({ term }) =>
          searchTracks(term).then((res) => ({
            data: res.message.body.track_list,
          })),
      }}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.track.track_id} mb={2} onClick={handleSelect}>
          <MusixmatchCard music={card} />
        </Box>
      )}
    </CardSearchDialogTest>
  );
}

export default Musixmatch;
