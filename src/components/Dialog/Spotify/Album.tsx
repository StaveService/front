import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import SpotifyAlbumCard from "../../Card/Spotify/Album";
import SpotifyButton from "../../Button/Spotify";
import { remove, selectSpotifyToken, setToken } from "../../../slices/spotify";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import queryKey from "../../../constants/queryKey.json";
import CardSearchDialogTest, { DialogProps } from "../CardSearchDialog";
import { searchSpotify, spotifyAccount } from "../../../axios/spotify";
import { ISpotifyAlbum, ISpotifyToken } from "../../../interfaces";

function Album({
  defaultValue,
  open,
  showSearchBar,
  onClose,
  onSelect,
}: DialogProps<ISpotifyAlbum>): JSX.Element {
  const { onError } = useQuerySnackbar();
  const spotifyToken = useSelector(selectSpotifyToken);
  const dispatch = useDispatch();
  const handleError = (err: unknown) => {
    onError(err);
    dispatch(remove());
  };
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
    <CardSearchDialogTest<ISpotifyAlbum>
      defaultValue={defaultValue}
      title="Spotify"
      open={open}
      useQueryArgs={{
        key: [queryKey.SPOTIFY, queryKey.ALBUMS],
        fn: ({ term, page }) =>
          searchSpotify<ISpotifyAlbum>(
            "album",
            term,
            page,
            spotifyToken?.access_token
          ).then((res) => ({
            data: res.albums.items,
            page: res.albums.offset,
            pageCount: Math.floor(res.albums.total / res.albums.limit),
          })),
        options: { onError: handleError },
      }}
      showSearchBar={showSearchBar}
      onSelect={onSelect}
      onClose={onClose}
    >
      {(card, handleSelect) => (
        <Box key={card.id} mb={2} onClick={handleSelect}>
          <SpotifyAlbumCard album={card} />
        </Box>
      )}
    </CardSearchDialogTest>
  );
}

export default Album;
