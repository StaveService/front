import Container from "@material-ui/core/Container";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import MusicTable from "../../components/Table/Music/Index";
import routes from "../../router/routes.json";

const Show: React.FC = () => {
  const params = useParams();
  useEffect(() => {
    axios
      .get(routes.ALBUMS)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Container>
      <p>Album Show</p>
      <MusicTable />
    </Container>
  );
};

export default Show;
