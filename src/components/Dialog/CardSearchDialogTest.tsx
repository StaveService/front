import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import { useQuery, UseQueryOptions } from "react-query";
import { useDebounce } from "use-debounce/lib";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  ISpotifyAlbum,
  ISpotifyArtist,
  ISpotifyTrack,
  ISpotifyTypes,
} from "../../interfaces";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";

type TCardTypes =
  | IItunesAlbum
  | IItunesArtist
  | IItunesMusic
  | ISpotifyAlbum
  | ISpotifyArtist
  | ISpotifyTrack;

export interface LayoutProps<TCard> {
  defaultValue?: string;
  open: boolean;
  title: string;
  showSearchBar?: boolean;
  useQueryArgs: {
    key: string[];
    fn: (
      term: string,
      spotifyType?: ISpotifyTypes,
      spotifyAccessToken?: string
    ) => Promise<TCard[]>;
    options?: UseQueryOptions<TCard[]>;
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
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const searched = useQuery<TCard[]>(
    [...useQueryArgs.key, debouncedSearchValue],
    () => useQueryArgs.fn(debouncedSearchValue || ""),
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
      if (searched.data) onSelect(searched.data[i]);
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
        {searched.data?.map((card, i) => {
          return children(card, handleSelect(i));
        })}
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
