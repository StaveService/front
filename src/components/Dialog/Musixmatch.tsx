import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce/lib";
import CardSearchDialog, { DialogProps } from "./CardSearchDialog";
import { IMusixmatchResponse, ISearchTrack, ITrack } from "../../interfaces";
import MusixmatchCard from "../Card/Musixcmatch";
import queryKey from "../../constants/queryKey.json";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import { searchTracks } from "../../axios/musixmatch";

function Musixmatch({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<ITrack>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const valueANDSearchValue = value || debouncedSearchValue;
  const searchedMusixmatch = useQuery<IMusixmatchResponse<ISearchTrack>>(
    [queryKey.MUSIXMATCH, valueANDSearchValue],
    () => searchTracks(valueANDSearchValue),
    {
      enabled: !!valueANDSearchValue,
      onError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  return (
    <CardSearchDialog<ITrack>
      title="Musixmatch"
      value={searchValue}
      open={open}
      loading={searchedMusixmatch.isLoading || isPending()}
      cards={searchedMusixmatch.data?.message.body.track_list}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
      onChange={handleChange}
    >
      {(card, handleSelect) => (
        <Box key={card.track.track_id} mb={2} onClick={handleSelect}>
          <MusixmatchCard music={card} />
        </Box>
      )}
    </CardSearchDialog>
  );
}

export default Musixmatch;
