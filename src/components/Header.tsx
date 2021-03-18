import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import routes from "../router/routes.json";

const Header: React.FC = () => (
  <AppBar position="static" color="default">
    <Toolbar>
      <Typography variant="h6">
        <Link underline="none" color="inherit" component={RouterLink} to="/">
          Stave
        </Link>
      </Typography>
      <Box ml="auto">
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
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
