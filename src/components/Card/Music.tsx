import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import { IItunesMusicsResponse, IMusic } from "../../interfaces";
import { itunes } from "../../axios";

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
  music: {
    title,
    itunes_track_id: itunesTrackId,
    music_composers: composers,
    music_lyrists: lyrists,
    band,
  },
}: IMusicCard) => {
  const classes = useStyles();
  const [artworkUrl, setArtworkUrl] = useState<string>("");
  useEffect(() => {
    if (!itunesTrackId) return;
    itunes
      .get<IItunesMusicsResponse>("/lookup", {
        params: { id: itunesTrackId, entity: "song" },
      })
      .then((res) => setArtworkUrl(res.data.results[0].artworkUrl100))
      .catch((err) => console.log(err));
  }, []);
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
          <CardMedia image={artworkUrl} className={classes.media} />
        </Box>
      </Box>
    </Card>
  );
};

export default MusicCard;
