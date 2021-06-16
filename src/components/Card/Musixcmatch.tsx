import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IMusicmatchTrack } from "../../interfaces";

interface IMusixmatchProps {
  music: IMusicmatchTrack;
}
const Musixmatch: React.FC<IMusixmatchProps> = ({
  music: { track },
}: IMusixmatchProps) => {
  return (
    <Card>
      <CardContent>
        <Typography>{track.track_name}</Typography>
        <Typography>{track.album_name}</Typography>
        <Typography>{track.artist_name}</Typography>
      </CardContent>
    </Card>
  );
};

export default Musixmatch;
