import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { useDebounce } from "use-debounce/lib";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import LinkIconButton from "../Button/Icon/Link";
import SpotifyIcon from "../Icon/Spotify";
import { remove, selectSpotifyCode, setCode } from "../../slices/spotify";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import CardSearchDialog, { DialogProps } from "./CardSearchDialog";
import { spotify } from "../../axios/spotify";

function Spotify({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<any>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const spotifyCode = useSelector(selectSpotifyCode);
  const dispatch = useDispatch();
  const handleError = (err: unknown) => {
    onError(err);
    dispatch(remove());
  };
  const searchedSpotify = useQuery<any>(
    [queryKey.SPOTIFY, debouncedSearchValue],
    () =>
      spotify.get("/search", {
        params: { type: "track", q: "abnormalize" },
        headers: { Authorization: `Bearer ${spotifyCode || "undefined"}` },
      }),
    {
      enabled: !!(debouncedSearchValue && open && spotifyCode),
      onError: handleError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  const dispatchCode = useCallback(
    (code: string) => {
      dispatch(setCode(code));
      axios.get(
        "https://accounts.spotify.com/api/token",
        code,
        window.location.origin
      );
    },
    [dispatch]
  );

  useEffect(() => {
    window.dispatchCode = dispatchCode;
  }, [dispatchCode]);

  useEffect(() => {
    if (value) setSearchValue(value);
  }, [value]);
  if (!spotifyCode)
    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="" fullWidth>
        <DialogTitle id="">Spotify need SignIn</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <LinkIconButton
              href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${
                process.env.REACT_APP_SPOTIFY_KEY || ""
              }&redirect_uri=${encodeURIComponent(window.location.origin)}`}
              windowFeatures="top=100,left=100,width=500,height=700"
            >
              <SpotifyIcon />
            </LinkIconButton>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  return (
    <CardSearchDialog<any>
      title="Spotify"
      value={searchValue}
      open={open}
      loading={searchedSpotify.isLoading || isPending()}
      cards={[]}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
      onChange={handleChange}
    >
      {(card, handleSelect) => (
        <Box key={1 /* card.pageid */} mb={2} onClick={handleSelect} />
      )}
    </CardSearchDialog>
  );
}

export default Spotify;
