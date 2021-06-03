import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { useDebounce } from "use-debounce/lib";
import ItunesArtistCard from "../../Card/Itunes/Artist";
import { IItunesArtist, IItunesResponse } from "../../../interfaces";
import Layout, { ItunesDialogProps } from "./Layout";
import queryKey from "../../../constants/queryKey.json";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import { searchItunesArtists } from "../../../axios/itunes";

function Artist({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: ItunesDialogProps<IItunesArtist>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const valueANDSearchValue = value || debouncedSearchValue;
  const searchedItunes = useQuery<
    AxiosResponse<IItunesResponse<IItunesArtist>>
  >(
    [queryKey.ITUNES, queryKey.ARTIST, valueANDSearchValue],
    () => searchItunesArtists(valueANDSearchValue),
    {
      enabled: !!valueANDSearchValue,
      onError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  return (
    <Layout
      title="Artist"
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
        <Box key={card.artistId} mb={2} onClick={handleSelect}>
          <ItunesArtistCard artist={card} />
        </Box>
      )}
    </Layout>
  );
}

export default Artist;
