import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SpotifyButton from "../../Button/Spotify";
import { remove, selectSpotifyToken, setToken } from "../../../slices/spotify";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import { DialogProps } from "../CardSearchDialogTest";
import { spotifyAccount } from "../../../axios/spotify";
import { ISpotifyToken, ISpotifyTypes } from "../../../interfaces";

interface LayoutProps<T extends ISpotifyTypes> extends DialogProps<T> {
  children: (props: { handleError: (err: unknown) => void }) => React.ReactNode;
}
function Layout<T extends ISpotifyTypes>({
  open,
  onClose,
  children,
}: Omit<LayoutProps<T>, "onSelect">): JSX.Element {
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
  return <>{children({ handleError })}</>;
}

export default Layout;
