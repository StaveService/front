import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce/lib";
import CardSearchDialog, { DialogProps } from "./CardSearchDialog";
import {
  IMusixmatchResponse,
  ISearchTrack,
  IMusicmatchTrack,
} from "../../interfaces";
import MusixmatchCard from "../Card/Musixcmatch";
import queryKey from "../../constants/queryKey.json";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import { searchTracks } from "../../axios/musixmatch";

function Musixmatch({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IMusicmatchTrack>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const searchedMusixmatch = useQuery<IMusixmatchResponse<ISearchTrack>>(
    [queryKey.MUSIXMATCH, debouncedSearchValue],
    () => searchTracks(debouncedSearchValue),
    {
      enabled: !!debouncedSearchValue && open,
      onError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  useEffect(() => {
    if (value) setSearchValue(value);
  }, [value]);
  return (
    <CardSearchDialog<IMusicmatchTrack>
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
