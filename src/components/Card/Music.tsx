import React from "react";
import { useQuery } from "react-query";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import { IItunesMusic, IItunesResponse, IMusic } from "../../interfaces";
import { itunes } from "../../axios";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface IMusicCard {
  music: IMusic;
}
const MusicCard: React.FC<IMusicCard> = ({
  music: { title, itunes_track_id: itunesTrackId, composers, lyrists, band },
}: IMusicCard) => {
  const classes = useStyles();
  const { onError } = useQuerySnackbar();
  const { data } = useQuery(
    ["itunesMusic", itunesTrackId],
    () =>
      itunes.get<IItunesResponse<IItunesMusic>>("/lookup", {
        params: { id: itunesTrackId, entity: "song" },
      }),
    { onError }
  );
  return (
    <Card>
      <Box display="flex">
        <Box flex={1}>
          <CardContent>
            <Typography>{title}</Typography>
            <Typography color="textSecondary" noWrap>
              Composer:
              {composers?.map(({ id, name }) => (
                <span key={id}>{name}</span>
              ))}
            </Typography>
            <Typography color="textSecondary" noWrap>
              Lyrist:
              {lyrists?.map(({ id, name }) => (
                <span key={id}>{name}</span>
              ))}
            </Typography>
            <Typography color="textSecondary" noWrap>
              Band: {band?.name}
            </Typography>
          </CardContent>
        </Box>
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia
            image={data?.data.results[0]?.artworkUrl100}
            className={classes.media}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default MusicCard;
