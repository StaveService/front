import React from "react";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import Layout from "./Layout";
import MusicCard from "../Card/Music";
import { IMusic } from "../../interfaces";
import routes from "../../constants/routes.json";

interface IMusicsProps {
  data: IMusic[] | undefined;
}
const Musics: React.FC<IMusicsProps> = ({ data }: IMusicsProps) => {
  const history = useHistory();
  return (
    <Layout<IMusic> cards={data}>
      {(card1, card2) => {
        const handleCard1Click = () =>
          history.push(
            `${routes.USERS}/${card1.user?.id || "undefined"}${routes.MUSICS}/${
              card1.id
            }`
          );
        const handleCard2Click = () =>
          history.push(
            `${routes.USERS}/${card1.user?.id || "undefined"}${routes.MUSICS}/${
              card2.id
            }`
          );
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MusicCard onClick={handleCard1Click} music={card1} />
            </Grid>
            <Grid item xs={6}>
              <MusicCard onClick={handleCard2Click} music={card2} />
            </Grid>
          </Grid>
        );
      }}
    </Layout>
  );
};
export default Musics;
