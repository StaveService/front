import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";
import { useQuery, UseQueryOptions } from "react-query";
import { useDebounce } from "use-debounce/lib";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IMusixmatchTrack,
  ISpotifyAlbum,
  ISpotifyArtist,
  ISpotifyTrack,
  ISpotifyTypes,
  IWikipedia,
} from "../../interfaces";
import usePaginate from "../../hooks/usePaginate";

type TCardTypes =
  | IItunesAlbum
  | IItunesArtist
  | IItunesMusic
  | ISpotifyAlbum
  | ISpotifyArtist
  | ISpotifyTrack
  | IMusixmatchTrack
  | IWikipedia;
interface FnValue<TCard> {
  data: TCard[] | undefined;
  page?: number;
  pageCount?: number;
}
export interface LayoutProps<TCard> {
  defaultValue?: string;
  open: boolean;
  title: string;
  showSearchBar?: boolean;
  useQueryArgs: {
    key: string[];
    fn: (
      variables: {
        term: string;
        page: number;
      },
      spotifyType?: ISpotifyTypes,
      spotifyAccessToken?: string
    ) => Promise<FnValue<TCard>>;
    options?: UseQueryOptions<FnValue<TCard>>;
  };
  children: (card: TCard, handleSelect: () => void) => React.ReactNode;
  onClose: () => void;
  onSelect: (selectedCard: TCard) => void;
}
export type DialogProps<TCard extends TCardTypes> = Omit<
  LayoutProps<TCard>,
  "useQueryArgs" | "title" | "children"
>;

function Layout<TCard extends TCardTypes>({
  defaultValue,
  open,
  title,
  showSearchBar,
  useQueryArgs,
  children,
  onClose,
  onSelect,
}: LayoutProps<TCard>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [page, handlePage] = usePaginate();
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const searched = useQuery(
    [...useQueryArgs.key, debouncedSearchValue, page],
    () => useQueryArgs.fn({ term: debouncedSearchValue, page }),
    {
      enabled: !!debouncedSearchValue && !isPending() && open,
      onError,
      ...useQueryArgs.options,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  const handleSelect = (i: number): (() => void) => {
    const select = () => {
      onClose();
      if (searched.data?.data) onSelect(searched.data.data[i]);
    };
    return select;
  };
  useEffect(() => {
    if (defaultValue) setSearchValue(defaultValue);
  }, [defaultValue]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Choose {title}</DialogTitle>
      <Box p={3}>
        {showSearchBar && (
          <TextField
            id=""
            label=""
            defaultValue={defaultValue}
            value={searchValue}
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
        )}
        {searched.isLoading && <LinearProgress />}
        {searched.data?.data?.map((card, i) => {
          return children(card, handleSelect(i));
        })}
        <Box display="flex" justifyContent="center">
          {searched.data?.pageCount && (
            <Pagination
              page={page}
              count={searched.data?.pageCount}
              onChange={handlePage}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
Layout.defaultProps = {
  value: "",
  showSearchBar: false,
  onChange: undefined,
};
export default Layout;
