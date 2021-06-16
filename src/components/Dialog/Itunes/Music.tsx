import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useDebounce } from "use-debounce/lib";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import ItunesMusicCard from "../../Card/Itunes/Music";
import { IItunesMusic, IItunesResponse } from "../../../interfaces";
import CardSearchDialog, { DialogProps } from "../CardSearchDialog";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import { searchItunesMusics } from "../../../axios/itunes";
import queryKey from "../../../constants/queryKey.json";

function Music({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IItunesMusic>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const searchedItunes = useQuery<AxiosResponse<IItunesResponse<IItunesMusic>>>(
    [queryKey.ITUNES, queryKey.MUSIC, debouncedSearchValue],
    () => searchItunesMusics(debouncedSearchValue),
    {
      enabled: !!debouncedSearchValue && open,
      onError,
    }
  );
  useEffect(() => {
    if (value) setSearchValue(value);
  }, [value]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  return (
    <CardSearchDialog
      title="Music"
      value={searchValue}
      open={open}
      loading={searchedItunes.isLoading || isPending()}
      cards={searchedItunes.data?.data.results}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
      onChange={handleChange}
    >
      {(card, handleSelect) => (
        <Box key={card.trackId} mb={2} onClick={handleSelect}>
          <ItunesMusicCard music={card} />
        </Box>
      )}
    </CardSearchDialog>
  );
}

export default Music;
