import React from "react";
import { FormattedMessage } from "react-intl";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import { IMusic } from "../../interfaces";
import { useLookupItunesMusic } from "../../reactQuery/itunes";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface IMusicCard {
  music: IMusic;
  onClick: () => void;
}
const BandCard: React.FC<IMusicCard> = ({ music, onClick }: IMusicCard) => {
  const classes = useStyles();
  const { data } = useLookupItunesMusic({ id: music.link.itunes });

  return (
    <Card onClick={onClick}>
      <Box display="flex">
        <Box display="flex" justifyItems="center" alignItems="center" p={1}>
          {data && (
            <CardMedia image={data[0].artworkUrl60} className={classes.media} />
          )}
        </Box>
        <CardContent>
          <Typography variant="h6" noWrap>
            {music.title}
          </Typography>
          {music.band?.name && (
            <Typography color="textSecondary" noWrap>
              <FormattedMessage id="band" />: {music.band?.name}
            </Typography>
          )}
          {music.composers?.length ? (
            <Typography color="textSecondary" noWrap>
              <FormattedMessage id="composer" />:{" "}
              {music.composers.map((composer) => (
                <span key={composer.id}>{composer.name}</span>
              ))}
            </Typography>
          ) : null}
        </CardContent>
      </Box>
    </Card>
  );
};

export default BandCard;
