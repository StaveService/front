import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce/lib";
import CardSearchDialog, { DialogProps } from "./CardSearchDialog";
import WikipediaCard from "../Card/Wikipedia";
import {
  IWikipedia,
  IWikipediaResponse,
  IWikipediaSearch,
} from "../../interfaces";
import queryKey from "../../constants/queryKey.json";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import { searchWikipedia } from "../../axios/wikipedia";

function Wikipedia({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IWikipedia>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const valueANDSearchValue = value || debouncedSearchValue;
  const searchedWikipedia = useQuery<IWikipediaResponse<IWikipediaSearch>>(
    [queryKey.WIKIPEDIA, valueANDSearchValue],
    () => searchWikipedia(valueANDSearchValue),
    {
      enabled: !!valueANDSearchValue,
      onError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  return (
    <CardSearchDialog<IWikipedia>
      title="Wikipedia"
      value={searchValue}
      open={open}
      loading={searchedWikipedia.isLoading || isPending()}
      cards={searchedWikipedia.data?.query.search}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
      onChange={handleChange}
    >
      {(card, handleSelect) => (
        <Box key={card.pageid} mb={2} onClick={handleSelect}>
          <WikipediaCard wikipedia={card} />
        </Box>
      )}
    </CardSearchDialog>
  );
}

export default Wikipedia;
