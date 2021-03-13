import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const Header:React.FC = () => (
  <AppBar position="static" color="default">
    <Toolbar>
      <Typography variant="h6">Stave</Typography>
      <Box ml="auto">
        <Button
          color="inherit"
          variant="contained"
          component={Link}
          to="/signin"
        >
          SignIn
        </Button>
        <Button
          color="inherit"
          variant="contained"
          component={Link}
          to="/signup"
        >
          SignUp
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
