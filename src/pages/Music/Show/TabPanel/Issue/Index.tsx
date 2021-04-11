import React, { useEffect, useState } from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import routes from "../../../../../router/routes.json";

const Index: React.FC = () => {
  const [issues, setIssues] = useState([]);
  const params = useParams<{ userId: string; id: string }>();
  const match = useRouteMatch();
  const route = `${routes.USERS}/${params.userId}${routes.MUSICS}/${params.id}${routes.ISSUES}`;
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).value)
      console.log(e);
  };
  useEffect(() => {
    axios
      .get(match.url)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <p>Issues</p>
      <TextField variant="outlined" onKeyPress={handleKeyPress} />
      <Button
        variant="contained"
        component={RouterLink}
        to={match.url + routes.NEW}
      >
        New
      </Button>
    </>
  );
};
export default Index;
