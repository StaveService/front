import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce/lib";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import SpotifyTrackCard from "../../Card/Spotify/Track";
import SpotifyButton from "../../Button/Spotify";
import { remove, selectSpotifyToken, setToken } from "../../../slices/spotify";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import queryKey from "../../../constants/queryKey.json";
import CardSearchDialog, { DialogProps } from "../CardSearchDialog";
import { searchSpotifyTrack, spotifyAccount } from "../../../axios/spotify";
import {
  ISpotifySearchResponse,
  ISpotifyToken,
  ISpotifyTrack,
} from "../../../interfaces";

function SpotifyTrack({
  value,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<ISpotifyTrack>): JSX.Element {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000);
  const { onError } = useQuerySnackbar();
  const spotifyToken = useSelector(selectSpotifyToken);
  const dispatch = useDispatch();
  const handleError = (err: unknown) => {
    onError(err);
    dispatch(remove());
  };
  const searchedSpotify = useQuery<ISpotifySearchResponse<ISpotifyTrack>>(
    [queryKey.SPOTIFY, debouncedSearchValue],
    () => searchSpotifyTrack(debouncedSearchValue, spotifyToken?.access_token),
    {
      enabled: !!(debouncedSearchValue && open && spotifyToken),
      onError: handleError,
    }
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);
  const getSpotifyCode = useCallback(
    async (code: string) => {
      const params = new URLSearchParams();
      params.append("code", code);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", window.location.origin);
      const res = await spotifyAccount.post<ISpotifyToken>("/token", params);
      dispatch(setToken(res.data));
    },
    [dispatch]
  );
  useEffect(() => {
    window.getSpotifyCode = getSpotifyCode;
  }, [getSpotifyCode]);

  useEffect(() => {
    if (value) setSearchValue(value);
  }, [value]);
  if (!spotifyToken)
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Spotify need SignIn</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SpotifyButton />
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
    <CardSearchDialog<ISpotifyTrack>
      title="Spotify"
      value={searchValue}
      open={open}
      loading={searchedSpotify.isLoading || isPending()}
      cards={
        searchedSpotify.data ? searchedSpotify.data.tracks.items : undefined
      }
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
      onChange={handleChange}
    >
      {(card, handleSelect) => (
        <Box key={card.id} mb={2} onClick={handleSelect}>
          <SpotifyTrackCard track={card} />
        </Box>
      )}
    </CardSearchDialog>
  );
}

export default SpotifyTrack;
