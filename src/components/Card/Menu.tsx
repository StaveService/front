import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AlbumIcon from "@material-ui/icons/Album";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import GroupIcon from "@material-ui/icons/Group";
import Box from "@material-ui/core/Box";
import routes from "../../constants/routes.json";
import { MenuCardType } from "../../interfaces";

interface ILayout {
  type: MenuCardType;
}
const Layout: React.FC<ILayout> = ({ type }: ILayout) => {
  let icon = null;
  let to = "";
  const size = "large";
  switch (type) {
    case "Album":
      icon = <AlbumIcon fontSize={size} />;
      to = routes.ALBUMS;
      break;
    case "Artist":
      icon = <AccessibilityNewIcon fontSize={size} />;
      to = routes.ARTISTS;
      break;
    case "Music":
      icon = <MusicNoteIcon fontSize={size} />;
      to = routes.MUSICS;
      break;
    case "Band":
      icon = <GroupIcon fontSize={size} />;
      to = routes.BANDS;
      break;
    default:
      return null;
  }
  return (
    <Card variant="outlined">
      <CardContent>
        <Box textAlign="center">{icon}</Box>
        <Typography variant="h5" component="h2">
          {type}
        </Typography>
        <Typography color="textSecondary">create {type}</Typography>
        <Typography variant="body2" component="p">
          create {type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`${to}${routes.NEW}`}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

export default Layout;
