import React from "react";
import { FormattedMessage } from "react-intl";
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
  icon: React.ReactNode;
  title: MenuCardType;
  messageId: string;
  to: string;
}
const Layout: React.FC<ILayout> = ({ icon, title, messageId, to }: ILayout) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box textAlign="center">{icon}</Box>
        <Typography variant="h5" component="h2">
          <FormattedMessage id={title} />
        </Typography>
        <Typography color="textSecondary">
          <FormattedMessage id={messageId} />
        </Typography>
        <Typography variant="body2" component="p">
          <FormattedMessage id={messageId} />
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`${to}${routes.NEW}`}>
          <FormattedMessage id="create" />
        </Button>
      </CardActions>
    </Card>
  );
};

export default Layout;
