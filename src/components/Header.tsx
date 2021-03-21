import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import routes from "../router/routes.json";
import { selectCurrentUser } from "../slices/currentUser";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentUser = useSelector(selectCurrentUser);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
                  to={`${routes.USER}${currentUser.id}`}
                >
                  Account
                </MenuItem>
                <MenuItem>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
