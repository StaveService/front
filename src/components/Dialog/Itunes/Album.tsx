import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { useDebounce } from "use-debounce/lib";
import ItunesAlbumCard from "../../Card/Itunes/Album";
import { IItunesAlbum, IItunesResponse } from "../../../interfaces";
import CardSearchDialog, { DialogProps } from "../CardSearchDialog";
import queryKey from "../../../constants/queryKey.json";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import { searchItunesAlbums } from "../../../axios/itunes";

function Album({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<IItunesAlbum>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const valueANDSearchValue = value || debouncedSearchValue;
  const searchedItunes = useQuery<AxiosResponse<IItunesResponse<IItunesAlbum>>>(
    [queryKey.ITUNES, queryKey.ALBUMS, valueANDSearchValue],
    () => searchItunesAlbums(valueANDSearchValue),
    {
      enabled: !!valueANDSearchValue,
      onError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  return (
    <CardSearchDialog
      title="Album"
      value={searchValue}
      open={open}
      loading={searchedItunes.isLoading || isPending()}
      cards={searchedItunes.data?.data?.results}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
      onChange={handleChange}
    >
      {(card, handleSelect) => (
        <Box key={card.collectionId} mb={2} onClick={handleSelect}>
          <ItunesAlbumCard album={card} />
        </Box>
      )}
    </CardSearchDialog>
  );
}
export default Album;
