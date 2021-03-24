import React, { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import routes from "../router/routes.json";
import {
  remove,
  selectCurrentUser,
  selectHeaders,
} from "../slices/currentUser";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  const history = useHistory();
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleSignOut = () => {
    if (!headers) return;
    axios
      .delete("/auth/sign_out", headers)
      .then(() => {
        dispatch(remove());
        history.push({
          pathname: routes.ROOT,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => handleClose());
  };
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6">
          <Link underline="none" color="inherit" component={RouterLink} to="/">
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
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
