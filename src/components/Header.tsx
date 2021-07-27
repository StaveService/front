/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import MenuItem from "@material-ui/core/MenuItem";
import { useMutation, useQuery } from "react-query";
import Popover from "@material-ui/core/Popover";
import routes from "../constants/routes.json";
import {
  remove,
  selectCurrentUser,
  selectHeaders,
} from "../slices/currentUser/currentUser";
import { getUserNotifications } from "../gql";

const Header: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const onMutate = () => {
    dispatch(remove());
    history.push({
      pathname: routes.SIGNIN,
    });
  };
  const onSuccess = () => {
    enqueueSnackbar("SignOut successful", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), {
      variant: "error",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };
  const notifications = useQuery(
    [routes.NOTIFICATIONS, 1],
    getUserNotifications(currentUser?.id, 1),
    { onError, enabled: !!currentUser }
  );
  const signOut = useMutation(() => axios.delete("/auth/sign_out", headers), {
    onMutate,
    onSuccess,
    onError,
  });
  const handleSignOut = () => signOut.mutate();
  return (
    <>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="h6">
            <Link
              underline="none"
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Stave
            </Link>
          </Typography>
          <Box ml="auto">
            {!currentUser?.id ? (
              <>
                <Button
                  color="inherit"
                  variant="contained"
                  component={RouterLink}
                  to={routes.SIGNIN}
                >
                  SignIn
                </Button>
                <Button
                  color="inherit"
                  variant="contained"
                  component={RouterLink}
                  to={routes.SIGNUP}
                >
                  SignUp
                </Button>
              </>
            ) : (
              <Box display="flex">
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <IconButton
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...bindTrigger(popupState)}
                      >
                        <NotificationsIcon />
                      </IconButton>
                      <Popover
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <Box p={1}>
                          {!notifications.data?.data.length && (
                            <Typography variant="h6">Nothing</Typography>
                          )}
                          {notifications.data?.data.map((notification) => {
                            if (
                              notification.type ===
                              "UserRelationshipNotification"
                            )
                              return (
                                <MenuItem
                                  key={notification.id}
                                  component={RouterLink}
                                  to={`${routes.USERS}/${notification.params.userRelationship.follower.id}`}
                                >
                                  {
                                    notification.params.userRelationship
                                      .follower.nickname
                                  }{" "}
                                  followed
                                </MenuItem>
                              );
                            if (
                              notification.type === "MusicBookmarkNotification"
                            )
                              return (
                                <MenuItem
                                  key={notification.id}
                                  component={RouterLink}
                                  to={`${routes.USERS}/${notification.params.musicBookmark.user.id}`}
                                >
                                  {
                                    notification.params.musicBookmark.user
                                      .nickname
                                  }{" "}
                                  bookmarked{" "}
                                  {
                                    notification.params.musicBookmark.music
                                      .title
                                  }
                                </MenuItem>
                              );
                            return <></>;
                          })}
                        </Box>
                      </Popover>
                    </div>
                  )}
                </PopupState>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <IconButton
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...bindTrigger(popupState)}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                      <Popover
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem
                          component={RouterLink}
                          to={`${routes.USERS}/${currentUser.id}`}
                        >
                          Account
                        </MenuItem>
                        <MenuItem
                          disabled={signOut.isLoading}
                          onClick={handleSignOut}
                        >
                          Logout
                        </MenuItem>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
