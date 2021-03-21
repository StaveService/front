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
import routes from "../../router/routes.json";
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
      to = routes.NEW_ALBUM;
      break;
    case "Artist":
      icon = <AccessibilityNewIcon fontSize={size} />;
      to = routes.NEW_ARTIST;
      break;
    case "Music":
      icon = <MusicNoteIcon fontSize={size} />;
      to = routes.NEW_MUSIC;
      break;
    case "Band":
      icon = <GroupIcon fontSize={size} />;
      to = routes.NEW_BAND;
      break;
    default:
      return null;
  }
  return (
    <Card variant="outlined">
      <CardContent>
        {icon}
        <Typography variant="h5" component="h2">
          {type}
        </Typography>
        <Typography color="textSecondary">create {type}</Typography>
        <Typography variant="body2" component="p">
          you can create {type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={to}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

export default Layout;
