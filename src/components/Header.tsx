import React, { useState } from "react";
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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useMutation } from "react-query";
import routes from "../constants/routes.json";
import {
  remove,
  selectCurrentUser,
  selectHeaders,
} from "../slices/currentUser";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const onMutate = () => {
    dispatch(remove());
    history.push({
      pathname: routes.SIGNIN,
    });
    handleClose();
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
  const { isLoading, mutate } = useMutation(
    () => axios.delete("/auth/sign_out", headers),
    { onMutate, onSuccess, onError }
  );
  const handleSignOut = () => mutate();
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
              <Box>
                <IconButton onClick={handleClick}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={RouterLink}
                    to={`${routes.USERS}/${currentUser.id}`}
                  >
                    Account
                  </MenuItem>
                  <MenuItem disabled={isLoading} onClick={handleSignOut}>
                    Logout
                  </MenuItem>
                </Menu>
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
