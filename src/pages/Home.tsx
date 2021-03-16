import axios from "axios";
import React, { useEffect } from "react";
import MusicTable from "../components/Table/Music";

const Home: React.FC = () => {
  useEffect(() => {
    axios
      .get("/musics")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });
  return (
    <>
      <p>home</p>
      <MusicTable />
    </>
  );
};

export default Home;
