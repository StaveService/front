import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import { useDebounce } from "use-debounce/lib";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import ItunesMusicCard from "../../Card/Itunes/Music";
import { IItunesMusic, IItunesResponse } from "../../../interfaces";
import Layout, { ItunesDialogProps } from "./Layout";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import { searchItunesMusics } from "../../../axios/itunes";
import queryKey from "../../../constants/queryKey.json";

function Music({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: ItunesDialogProps<IItunesMusic>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const valueANDSearchValue = value || debouncedSearchValue;
  const searchedItunes = useQuery<AxiosResponse<IItunesResponse<IItunesMusic>>>(
    [queryKey.ITUNES, queryKey.MUSIC, valueANDSearchValue],
    () => searchItunesMusics({ term: valueANDSearchValue }),
    {
      enabled: !!valueANDSearchValue,
      onError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  return (
    <Layout
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
    </Layout>
  );
}

export default Music;
